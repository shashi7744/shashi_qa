export default function BugReport() {
  return (
    <article className="bug-report" aria-label="Sample bug report">
      <header className="bug-head">
        <span className="mono">BUG-014</span>
        <span className="pill pill-high">High</span>
        <span className="pill">Open</span>
      </header>
      <h3>Pay button does nothing on iPhone Safari</h3>
      <dl className="bug-meta">
        <div><dt>Environment</dt><dd>iPhone 13 · iOS 17 · Safari</dd></div>
        <div><dt>Build</dt><dd>v2.4.1 (staging)</dd></div>
      </dl>
      <div className="bug-section">
        <span className="label">Steps to reproduce</span>
        <ol>
          <li>Log in as a test customer</li>
          <li>Add any item to the cart</li>
          <li>Go to checkout and tap “Pay now”</li>
        </ol>
      </div>
      <div className="bug-cols">
        <div><span className="label">Expected</span><p>Payment sheet opens.</p></div>
        <div><span className="label">Actual</span><p>Nothing happens. Console shows a TypeError.</p></div>
      </div>
      <footer className="bug-foot mono">📎 screen-recording.mp4 · console-log.txt</footer>
    </article>
  );
}
