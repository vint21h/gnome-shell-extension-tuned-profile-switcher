// tuned-profile-switcher
// dbus.js


"use strict";

const Gio = imports.gi.Gio;  // jshint ignore:line


const tunedInterface = `
<!DOCTYPE node PUBLIC "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN" "https://specifications.freedesktop.org/dbus/introspect-latest.dtd">
<node name="/Tuned">
  <interface name="com.redhat.tuned.control">
    <method name="active_profile">
      <arg direction="out" type="s" />
    </method>
    <method name="auto_profile">
      <arg direction="out" type="(bs)" />
    </method>
    <method name="disable">
      <arg direction="out" type="b" />
    </method>
    <method name="get_all_plugins">
      <arg direction="out" type="a{sa{ss}}" />
    </method>
    <method name="get_plugin_documentation">
      <arg direction="in"  type="s" name="plugin_name" />
      <arg direction="out" type="s" />
    </method>
    <method name="get_plugin_hints">
      <arg direction="in"  type="s" name="plugin_name" />
      <arg direction="out" type="a{ss}" />
    </method>
    <method name="is_running">
      <arg direction="out" type="b" />
    </method>
    <method name="log_capture_finish">
      <arg direction="in"  type="s" name="token" />
      <arg direction="out" type="s" />
    </method>
    <method name="log_capture_start">
      <arg direction="in"  type="i" name="log_level" />
      <arg direction="in"  type="i" name="timeout" />
      <arg direction="out" type="s" />
    </method>
    <method name="post_loaded_profile">
      <arg direction="out" type="s" />
    </method>
    <method name="profile_info">
      <arg direction="in"  type="s" name="profile_name" />
      <arg direction="out" type="(bsss)" />
    </method>
    <method name="profile_mode">
      <arg direction="out" type="(ss)" />
    </method>
    <method name="profiles">
      <arg direction="out" type="as" />
    </method>
    <method name="profiles2">
      <arg direction="out" type="a(ss)" />
    </method>
    <method name="recommend_profile">
      <arg direction="out" type="s" />
    </method>
    <method name="reload">
      <arg direction="out" type="b" />
    </method>
    <method name="start">
      <arg direction="out" type="b" />
    </method>
    <method name="stop">
      <arg direction="out" type="b" />
    </method>
    <method name="switch_profile">
      <arg direction="in"  type="s" name="profile_name" />
      <arg direction="out" type="(bs)" />
    </method>
    <method name="verify_profile">
      <arg direction="out" type="b" />
    </method>
    <method name="verify_profile_ignore_missing">
      <arg direction="out" type="b" />
    </method>
    <signal name="profile_changed">
      <arg type="s" name="profile_name" />
      <arg type="b" name="result" />
      <arg type="s" name="errstr" />
    </signal>
  </interface>
</node>
`;
const tunedDBusProxy = Gio.DBusProxy.makeProxyWrapper(tunedInterface);
var tunedProxy = new tunedDBusProxy(  // jshint ignore:line
    Gio.DBus.system,
    "com.redhat.tuned",
    "/Tuned"
);
