import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: "#555",
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#d32f2f",
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h2 style={{ margin: "0 0 0.25rem" }}>Contact us</h2>
      <p style={{ fontSize: "14px", color: "#777", marginBottom: "2rem" }}>
        Fill out the form below and we'll get back to you shortly.
      </p>

      {/* First + Last name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>First name</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Jane"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Last name</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Doe"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
        </div>
      </div>

      {/* Email */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          type="email"
          placeholder="jane@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <span style={errorStyle}>{errors.email}</span>}
      </div>

      {/* Message */}
      <div style={fieldStyle}>
        <label style={labelStyle}>
          Message <span style={{ fontWeight: 400, color: "#aaa" }}>(optional)</span>
        </label>
        <textarea
          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          placeholder="Tell us more..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          cursor: submitted ? "default" : "pointer",
          background: submitted ? "#f5f5f5" : "transparent",
        }}
      >
        {submitted ? "Sent ✓" : "Send message"}
      </button>

      {submitted && (
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#2e7d32", textAlign: "center" }}>
          Your message has been sent. We'll be in touch soon.
        </p>
      )}
    </div>
  );
}
