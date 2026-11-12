package com.torquemedic.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Must happen before super.onCreate so the bridge knows the plugin when
        // the web layer asks for window.Capacitor.Plugins.VehicleLink.
        registerPlugin(VehicleLinkPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
