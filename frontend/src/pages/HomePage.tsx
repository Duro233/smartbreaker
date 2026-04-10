import devicePhoto from "../images/sabre-device.jpg";

export default function HomePage() {
  return (
    <div style={{ width: "100%", boxSizing: "border-box" as const, fontFamily: "sans-serif" }}>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2.5rem",
        alignItems: "center",
        padding: "3rem 2rem",
        borderBottom: "1px solid #e5e5e5",
      }}>
        <div>
          <span style={{
            display: "inline-block", background: "#e8f0fe", color: "#1a56db",
            fontSize: "11px", fontWeight: 500, padding: "4px 10px",
            borderRadius: "20px", marginBottom: "1rem", letterSpacing: "0.04em",
          }}>
            S.A.B.R.E. — Smart Assessing Breaker for Residential Environments
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 500, margin: "0 0 1rem", lineHeight: 1.3 }}>
            Intelligent circuit protection, controlled from anywhere
          </h1>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.8, margin: 0 }}>
            S.A.B.R.E. combines a smart circuit breaker device with a real-time web dashboard.
            Users can monitor power consumption, trip breakers remotely, and get instant alerts all from your browser.
          </p>
        </div>
        <img
          src={devicePhoto}
          alt="S.A.B.R.E. device"
          style={{ width: "100%", borderRadius: "12px", border: "1px solid #e5e5e5", objectFit: "cover" }}
        />
      </section>

      {/* Features */}
      <section style={{ padding: "2.5rem 2rem", borderBottom: "1px solid #e5e5e5" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 500, margin: "0 0 1.5rem" }}>What S.A.B.R.E. does</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {[
            { title: "Remote control", body: "Trip or reset individual breakers from the dashboard without being physically present at the panel." },
            { title: "Real-time monitoring", body: "View live current and voltage readings streamed directly from the ESP32 via WebSocket." },
            { title: "Automatic protection", body: "The device detects overloads and short circuits and trips the breaker automatically to protect your equipment." },
            { title: "Event history", body: "Every trip, reset, and threshold breach is logged in MongoDB so you can review your circuit's history anytime." },
          ].map(({ title, body }) => (
            <div key={title} style={{ background: "#f7f7f7", borderRadius: "8px", padding: "1rem" }}>
              <p style={{ fontSize: "13px", fontWeight: 500, margin: "0 0 6px" }}>{title}</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Setup steps */}
      <section style={{ padding: "2.5rem 2rem" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 500, margin: "0 0 1.5rem" }}>How to set it up</h2>
        {[
          { n: 1, title: "Install the device", body: "Mount the S.A.B.R.E. unit in your breaker panel and connect it in series with the circuit you want to monitor." },
          { n: 2, title: "Connect to Wi-Fi", body: "Power on the device. It will broadcast a setup hotspot. Connect and enter your Wi-Fi credentials through the setup portal." },
          { n: 3, title: "Create an account", body: "Register at the S.A.B.R.E. web app. Your device will automatically appear in your dashboard once it's online." },
          { n: 4, title: "Configure your thresholds", body: "Set current and voltage limits in the dashboard. S.A.B.R.E. will alert you and trip the breaker if any limit is exceeded." },
          { n: 5, title: "Monitor and control", body: "Use the dashboard to view live readings, manage breaker states, and review your circuit event history from anywhere." },
        ].map(({ n, title, body }, i, arr) => (
          <div key={n} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: i < arr.length - 1 ? "1px solid #e5e5e5" : "none" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", background: "#e8f0fe",
              color: "#1a56db", fontSize: "13px", fontWeight: 500,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px",
            }}>{n}</div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 4px" }}>{title}</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
