/**
 * Keeps the Play version name and package.json in step.
 *
 * versionName is what Play shows; package.json is what the About card reads. If
 * they drift, the store listing and the installed app report different versions.
 * Run: npm run check:versions
 */
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const gradle = readFileSync(new URL('android/app/build.gradle', root), 'utf8');

const match = gradle.match(/versionName\s+"([^"]+)"/);
if (!match) {
  console.error('check:versions — no versionName found in android/app/build.gradle');
  process.exit(1);
}

const androidVersion = match[1];
if (androidVersion !== pkg.version) {
  console.error(`check:versions — Android versionName "${androidVersion}" != package.json "${pkg.version}"`);
  process.exit(1);
}

const code = gradle.match(/versionCode\s+(\d+)/);
console.log(`check:versions — versionName ${androidVersion} matches package.json (versionCode ${code ? code[1] : '?'})`);
