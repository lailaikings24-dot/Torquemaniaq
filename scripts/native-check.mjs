/**
 * Checks that the Android and iOS projects are wired for Bluetooth and shipping
 * the same web build as the deployed site.
 *
 * These are the failure modes that cost real device-testing cycles: a plugin
 * that is never registered, a missing usage string (iOS kills the app), a
 * missing permission (Android silently returns no devices), and a stale copy of
 * `dist` baked into the app. None of them fail a Gradle or Xcode build, so they
 * are checked here instead. Run: npm run check:native
 */
import { existsSync, readFileSync } from 'node:fs';

let failures = 0;

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`  PASS  ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const read = (path) => {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
};

const appConfig = JSON.parse(read('capacitor.config.json') || '{}');
const androidConfig = read('android/app/src/main/assets/capacitor.config.json');
const iosConfig = read('ios/App/App/capacitor.config.json');
const manifest = read('android/app/src/main/AndroidManifest.xml');
const plist = read('ios/App/App/Info.plist');
const mainActivity = read('android/app/src/main/java/com/torquemedic/app/MainActivity.java');
const kotlin = read('android/app/src/main/java/com/torquemedic/app/VehicleLinkPlugin.kt');
const swift = read('ios/App/App/VehicleLinkPlugin.swift');
const pbxproj = read('ios/App/App.xcodeproj/project.pbxproj');
const gradle = read('android/app/build.gradle');

// ---- projects exist ------------------------------------------------------- //

check('Android project generated', existsSync('android/app/build.gradle') && existsSync('android/gradlew'));
check('iOS project generated', existsSync('ios/App/App.xcodeproj/project.pbxproj'));
check('app id matches everywhere', Boolean(appConfig.appId) && gradle.includes(`applicationId "${appConfig.appId}"`));

// ---- shared web build ----------------------------------------------------- //

const shell = read('dist/index.html');
const bundle = shell.match(/\/assets\/(index-[A-Za-z0-9_-]+\.js)/)?.[1];
const style = shell.match(/\/assets\/(index-[A-Za-z0-9_-]+\.css)/)?.[1];
check('dist contains a hashed bundle', Boolean(bundle && style), bundle || 'no index-*.js in dist/index.html');
check(
  'Android ships the same web build as dist',
  Boolean(bundle) && existsSync(`android/app/src/main/assets/public/assets/${bundle}`) &&
    existsSync(`android/app/src/main/assets/public/assets/${style}`),
  'run npm run native:sync',
);
check(
  'iOS ships the same web build as dist',
  Boolean(bundle) && existsSync(`ios/App/App/public/assets/${bundle}`) &&
    existsSync(`ios/App/App/public/assets/${style}`),
  'run npm run native:sync',
);

// ---- Android ------------------------------------------------------------------ //

check('Android plugin source present', /class VehicleLinkPlugin : Plugin\(\)/.test(kotlin));
check('Android plugin is named VehicleLink', /name = "VehicleLink"/.test(kotlin));
check('Android plugin registered in MainActivity', /registerPlugin\(VehicleLinkPlugin\.class\)/.test(mainActivity));

for (const permission of ['BLUETOOTH_SCAN', 'BLUETOOTH_CONNECT', 'ACCESS_FINE_LOCATION', 'INTERNET']) {
  check(`manifest declares ${permission}`, manifest.includes(`android.permission.${permission}`));
}
check('manifest declares BLE hardware as optional', /hardware\.bluetooth_le" android:required="false"/.test(manifest));
check(
  'manifest keeps location scoped to Android 11 and older',
  /ACCESS_FINE_LOCATION"\s*\n?\s*android:maxSdkVersion="30"/.test(manifest),
);
check('Android config uses the shipped web dir', androidConfig.includes('"webDir": "dist"'));

// The Bluetooth plugin is Kotlin. Without these two lines Gradle ignores the
// .kt file and MainActivity fails to compile with "cannot find symbol".
check(
  'root Gradle has the Kotlin plugin classpath',
  read('android/build.gradle').includes('org.jetbrains.kotlin:kotlin-gradle-plugin'),
  'add classpath org.jetbrains.kotlin:kotlin-gradle-plugin to android/build.gradle',
);
check(
  'app module applies the Kotlin plugin',
  /apply plugin: 'org\.jetbrains\.kotlin\.android'/.test(gradle),
  'add apply plugin: org.jetbrains.kotlin.android to android/app/build.gradle',
);

// ---- iOS ---------------------------------------------------------------------- //

check('iOS plugin source present', /class VehicleLinkPlugin: CAPPlugin, CAPBridgedPlugin/.test(swift));
check('iOS plugin exposes the VehicleLink name', /jsName = "VehicleLink"/.test(swift));
check(
  'iOS plugin is in the App target sources',
  pbxproj.includes('VehicleLinkPlugin.swift in Sources') && pbxproj.includes('/* VehicleLinkPlugin.swift */ = {isa'),
);
check(
  'iOS bridge is told to load the local plugin',
  iosConfig.includes('"VehicleLinkPlugin"'),
  'run npm run native:sync (it re-registers after cap sync)',
);

for (const key of ['NSBluetoothAlwaysUsageDescription', 'NSBluetoothPeripheralUsageDescription']) {
  check(`Info.plist declares ${key}`, plist.includes(`<key>${key}</key>`));
}
check('Info.plist has no placeholder battery string', !plist.includes('TODO'));

// ---- store readiness ----------------------------------------------------------- //

// Release builds must never come out unsigned: Play rejects them and they cannot
// be installed. The Gradle guard is the thing that prevents that.
check(
  'release signing is wired',
  gradle.includes('signingConfig signingConfigs.release') &&
    gradle.includes('keystore.properties') &&
    /if \(releasing && !releaseKeystorePath\)/.test(gradle),
  'android/app/build.gradle must fail instead of producing an unsigned release',
);

// xcodebuild -scheme only works when the scheme is shared inside the project.
const schemePath = 'ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme';
const scheme = read(schemePath);
const targetId = pbxproj.match(/\n\t\t([A-F0-9]{24}) \/\* App \*\/ = \{\n\t\t\tisa = PBXNativeTarget;/)?.[1];
check(
  'iOS has a shared scheme for the release workflow',
  existsSync(schemePath) && Boolean(targetId) && scheme.includes(`BlueprintIdentifier = "${targetId}"`),
  'add ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme pointing at the App target',
);

// Both stores require a reachable privacy policy for Bluetooth/location access.
const privacy = read('public/privacy.htm');
check(
  'privacy policy page exists and covers the permissions',
  privacy.includes('BLUETOOTH_SCAN') && privacy.includes('neverForLocation') && privacy.length > 2000,
);

// ---- JS bridge agreement ------------------------------------------------------ //

// The copies inside the generated projects are what actually compile, so guard
// them against edits that only land in native/.
check(
  'Android plugin copy matches native/android',
  kotlin === read('native/android/VehicleLinkPlugin.kt') && kotlin.length > 0,
  're-copy native/android/VehicleLinkPlugin.kt into android/app/src/main/java/com/torquemedic/app/',
);
check(
  'iOS plugin copy matches native/ios',
  swift === read('native/ios/VehicleLinkPlugin.swift') && swift.length > 0,
  're-copy native/ios/VehicleLinkPlugin.swift into ios/App/App/',
);
check(
  'Android requests the permission that exists on the running version',
  /Build\.VERSION_CODES\.S\) "location" else "bluetooth"/.test(kotlin) && kotlin.includes('Permission(\n            alias = "location"'),
);

const bridge = read('src/lib/native/bridge.ts');
check('web bridge looks up the same plugin name', bridge.includes('Plugins?.VehicleLink'));
check('web bridge only uses Capacitor when the shell provides it', bridge.includes('window as unknown as { Capacitor'));

console.log(failures === 0 ? '\nALL NATIVE CHECKS PASSED' : `\n${failures} NATIVE CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
