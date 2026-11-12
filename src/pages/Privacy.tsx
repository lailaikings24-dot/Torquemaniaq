import { useEffect } from 'react';
import { Icon } from '../components/Icon';

const UPDATED = '12 November 2026';

export function Privacy() {
  useEffect(() => {
    document.title = 'Privacy policy — TorqueMedic';
  }, []);

  return (
    <div className="app">
      <main className="main" style={{ paddingBottom: 24 }}>
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <Icon name="gauge" size={18} className="muted" />
            </span>
            <div>
              <div className="brand-name">TorqueMedic</div>
              <div className="brand-sub">Privacy policy</div>
            </div>
          </div>
          <div className="topbar-spacer" />
          <a className="btn btn-sm btn-ghost" href="/">
            Open the app
          </a>
        </header>

        <div className="content" style={{ maxWidth: 780 }}>
          <div className="page-head">
            <div>
              <h1 className="page-title">Privacy policy</h1>
              <p className="page-desc">Last updated {UPDATED}</p>
            </div>
          </div>

          <div className="notice notice-ok">
            <Icon name="check" size={17} />
            <div>
              <strong>TorqueMedic does not collect your personal data.</strong> There is no account, no analytics, no
              advertising and no tracking. Diagnostic data from your car stays on the device you use.
            </div>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">Who this covers</h2>
            <p className="small muted">
              This policy applies to the TorqueMedic Android app and to the web version at this address. They are the
              same application: an OBD-II diagnostic tool that talks to an ELM327-compatible adapter over Bluetooth or
              Wi-Fi. The developer can be reached using the contact details at the end of this page.
            </p>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">What the app handles</h2>
            <p className="small muted">
              When an adapter is connected, the app reads data the vehicle&apos;s engine control unit makes available:
              trouble codes, freeze-frame data, readiness monitors, sensor values, VIN and calibration identifiers. This
              is processed on your device to show the dashboard, charts, code explanations and repair guidance.
            </p>
            <p className="small muted">
              The app stores a small amount of information locally so it works the way you left it: your vehicle
              profile, custom PIDs, repair notes, app settings and the last adapter you used. This is kept in the
              app&apos;s private storage on your device and is not uploaded anywhere.
            </p>
            <p className="small muted">
              If you use a Wi-Fi adapter or a serial-to-WebSocket bridge, the app connects directly to the address you
              enter on your own network. That connection is between your device and the adapter; it does not pass
              through our servers.
            </p>
            <p className="small muted">
              Exports (CSV logs, code reports, repair histories) are created only when you tap an export button, and go
              only to the destination you choose in the share or save dialog.
            </p>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">Permissions and why they are needed</h2>
            <ul className="small muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
              <li>
                <strong>Bluetooth</strong> — to scan for, pair with and talk to a Bluetooth OBD-II adapter. On Android
                12 and newer the app requests the nearby-devices permissions with the &ldquo;never for location&rdquo;
                flag. Older Android versions required Bluetooth permissions at install time.
              </li>
              <li>
                <strong>Location (Android 11 and older only)</strong> — the operating system required location
                permission for Bluetooth discovery on those versions. The app does not request it on newer Android, does
                not read your position and does not store or transmit it.
              </li>
              <li>
                <strong>Internet / local network</strong> — to load the web app and to reach a Wi-Fi adapter on your own
                network. The Android app allows plain <span className="mono">ws://</span> traffic because ELM327 Wi-Fi
                adapters expose an unencrypted local bridge.
              </li>
            </ul>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">The web version</h2>
            <p className="small muted">
              The web version is a static site. It sets no cookies and runs no analytics, advertising or tracking
              scripts. It keeps the same local settings in your browser&apos;s storage, and installs an offline cache so
              the app can load without a connection. Like any website, the hosting provider may keep standard request
              logs (such as IP address, browser user agent and time) for security and reliability; we do not use them to
              identify or profile visitors.
            </p>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">What we never do</h2>
            <ul className="small muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
              <li>No account, sign-in or cloud sync — there is nothing to register.</li>
              <li>No collection or sale of personal data, and no sharing with advertisers or data brokers.</li>
              <li>No analytics, crash reporting, advertising SDKs or social plug-ins.</li>
              <li>No access to your contacts, photos, messages, call logs or precise location.</li>
            </ul>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">Keeping and deleting your data</h2>
            <p className="small muted">
              Because the data stays on your device, you stay in control of it. Clear the app&apos;s storage in Android
              settings, or uninstall the app, to remove everything it has saved. Files you exported earlier remain
              wherever you saved them until you delete them. We hold no server-side copy, so there is no request to send
              us and no deletion queue to wait for.
            </p>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">Children</h2>
            <p className="small muted">
              TorqueMedic is a tool for vehicle owners and is not directed at children. It does not knowingly collect
              information from anyone, including children under 13.
            </p>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">Security</h2>
            <p className="small muted">
              Locally stored data is protected by your device&apos;s own app sandbox and lock screen. Bluetooth and
              Wi-Fi links go directly to the adapter; we cannot see them. No method of storage is perfectly secure, so
              keep your device protected with a screen lock and current system updates.
            </p>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">Changes to this policy</h2>
            <p className="small muted">
              If the app starts handling data differently, this page will be updated and the date at the top will
              change. Material changes will also be noted in the app&apos;s release notes on Google Play.
            </p>
          </div>

          <div className="card card-pad col">
            <h2 className="card-title">Contact</h2>
            <p className="small muted">
              Questions about this policy or the app&apos;s data handling:{' '}
              <a href="mailto:privacy@torquemaniaq.com">privacy@torquemaniaq.com</a>. You can also open an issue in the
              project repository.
            </p>
          </div>

          <p className="tiny muted center" style={{ marginTop: 4 }}>
            TorqueMedic · OBD-II diagnostics
          </p>
        </div>
      </main>
    </div>
  );
}
