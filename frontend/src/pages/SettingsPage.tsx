//displays the user settings
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "John", email: "Doe@example.com" });
  const [notifications, setNotifications] = useState({ emailAlerts: true, tripAlerts: true, offlineAlerts: false });
  const [saved, setSaved] = useState(false);
  useScrollReveal();

  const handleSave = async () => {
  try {
    const userId = 'USER_ID_HERE'; //add id

    const res = await fetch(`/api/settings/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profile.name,
        email: profile.email,
        notifications,
      }),
    });

    if (!res.ok) throw new Error('Save failed');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  } catch (err) {
    console.error(err);
    alert('Could not save settings. Please try again.');
  }
};

  const rowStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0.875rem 1.25rem", borderBottom: "1px solid #e5e5e5", gap: "1rem",
  } as React.CSSProperties;

  const sectionStyle = {
    border: "1px solid #e5e5e5", borderRadius: "12px",
    background: "#fff", marginBottom: "1.25rem", overflow: "hidden",
  } as React.CSSProperties;

  const inputStyle = { padding: "6px 10px", borderRadius: "8px", border: "1px solid #e0e0e0", fontSize: "13px" };
  const labelStyle = { fontSize: "13px", fontWeight: 500, margin: "0 0 2px", display: "block" } as React.CSSProperties;
  const hintStyle = { fontSize: "12px", color: "#888", margin: 0 };

  const SectionHeader = ({ title, desc }: { title: string; desc: string }) => (
    <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #e5e5e5" }}>
      <p style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 2px" }}>{title}</p>
      <p style={hintStyle}>{desc}</p>
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      style={{
        width: "40px", height: "22px", borderRadius: "22px", cursor: "pointer", flexShrink: 0,
        background: checked ? "#185FA5" : "#ccc", position: "relative", transition: "background 0.2s",
      }}
    >
      <div style={{
        position: "absolute", width: "16px", height: "16px", borderRadius: "50%",
        background: "white", top: "3px", left: checked ? "21px" : "3px", transition: "left 0.2s",
      }} />
    </div>
  );

  return (
    <div style={{ width: "100%", padding: "2rem", boxSizing: "border-box" }}>
      <h2 style={{ margin: "0 0 0.25rem" }}>Settings</h2>
      <p style={{ fontSize: "14px", color: "#777", marginBottom: "2rem" }}>
        Manage your account and notification preferences.
      </p>

      {/* Profile */}
      <div style={sectionStyle}>
        <SectionHeader title="Profile" desc="Your personal account information" />
        <div style={rowStyle}>
          <div><p style={labelStyle}>Full name</p></div>
          <input style={{ ...inputStyle, width: "200px" }} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div style={rowStyle}>
          <div><p style={labelStyle}>Email address</p></div>
          <input style={{ ...inputStyle, width: "200px" }} type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div><p style={labelStyle}>Password</p><p style={hintStyle}>Last changed 30 days ago</p></div>
          <button style={{ ...inputStyle, cursor: "pointer" }}>Change password</button>
        </div>
      </div>

      {/* Notifications */}
      <div style={sectionStyle}>
        <SectionHeader title="Notifications" desc="Choose when and how you get alerted" />
        {([
          ["emailAlerts", "Email alerts", "Send an email when a threshold is exceeded"],
          ["tripAlerts", "Trip alerts", "Notify when the breaker trips"],
          ["offlineAlerts", "Device offline alerts", "Notify if the device loses connection"],
        ] as [keyof typeof notifications, string, string][]).map(([key, label, hint], i, arr) => (
          <div key={key} style={{ ...rowStyle, borderBottom: i < arr.length - 1 ? "1px solid #e5e5e5" : "none" }}>
            <div><p style={labelStyle}>{label}</p><p style={hintStyle}>{hint}</p></div>
            <Toggle checked={notifications[key]} onChange={() => setNotifications({ ...notifications, [key]: !notifications[key] })} />
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div style={{ ...sectionStyle, borderColor: "#fca5a5" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #fca5a5" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#dc2626", margin: 0 }}>Danger zone</p>
        </div>
        <div style={rowStyle}>
          <div><p style={labelStyle}>Delete account</p><p style={hintStyle}>Permanently delete your account and all data</p></div>
          <button style={{ ...inputStyle, color: "#dc2626", borderColor: "#fca5a5", cursor: "pointer" }}>Delete account</button>
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div><p style={labelStyle}>Unpair device</p><p style={hintStyle}>Remove the S.A.B.R.E. device from your account</p></div>
          <button style={{ ...inputStyle, color: "#dc2626", borderColor: "#fca5a5", cursor: "pointer" }}>Unpair</button>
        </div>
      </div>

      {/* Save bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", paddingTop: "0.5rem" }}>
        {saved && <span style={{ fontSize: "13px", color: "#15803d" }}>Changes saved</span>}
        <button onClick={handleSave} style={{ ...inputStyle, cursor: "pointer", fontWeight: 500, padding: "8px 20px" }}>
          Save changes
        </button>
      </div>
    </div>
  );
}
