/**
 * Runs after `npx cap sync`.
 *
 * Capacitor rebuilds ios/App/App/capacitor.config.json on every sync and fills
 * `packageClassList` from installed plugin packages only. VehicleLink lives in
 * the app target itself, not in a package, so its entry would be wiped each
 * time — and without that entry the iOS bridge never instantiates the plugin.
 *
 * Android does not need this step: MainActivity registers the plugin in code.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const IOS_CONFIG = 'ios/App/App/capacitor.config.json';

/** Classes resolved with NSClassFromString at bridge start-up. */
const LOCAL_PLUGINS = ['VehicleLinkPlugin'];

const config = JSON.parse(readFileSync(IOS_CONFIG, 'utf8'));
const list = new Set(config.packageClassList ?? []);
for (const plugin of LOCAL_PLUGINS) list.add(plugin);
config.packageClassList = [...list];
writeFileSync(IOS_CONFIG, `${JSON.stringify(config, null, 2)}\n`);

console.log(`ios: bridge will load ${config.packageClassList.join(', ')}`);
