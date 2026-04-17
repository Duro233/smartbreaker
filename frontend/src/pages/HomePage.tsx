import breakerPhoto from "../images/breaker.webp";
import Navigation from "../components/home-comp/navigation/login-navigation";
import { useEffect, useState } from "react";
import Background from "../components/background/Background";
import { useScrollReveal } from "../hooks/useScrollReveal";

import { Flex, Grid } from "@mantine/core";

const HOME_HEADING_TEXT = "Intelligent circuit protection, controlled from anywhere";
const FEATURES = [
  {
    title: "Remote control",
    body: "Trip or reset individual breakers from the dashboard without being physically present at the panel.",
  },
  {
    title: "Real-time monitoring",
    body: "View live current and voltage readings streamed directly from the ESP32 via WebSocket.",
  },
  {
    title: "Automatic protection",
    body: "The device detects overloads and short circuits and trips the breaker automatically to protect your equipment.",
  },
  {
    title: "Event history",
    body: "Every trip, reset, and threshold breach is logged in MongoDB so you can review your circuit's history anytime.",
  },
];
const SETUP_STEPS = [
  {
    n: 1,
    title: "Install the device",
    body: "Mount the S.A.B.R.E. unit in your breaker panel and connect it in series with the circuit you want to monitor.",
  },
  {
    n: 2,
    title: "Connect to Wi-Fi",
    body: "Power on the device. It will broadcast a setup hotspot. Connect and enter your Wi-Fi credentials through the setup portal.",
  },
  {
    n: 3,
    title: "Create an account",
    body: "Register at the S.A.B.R.E. web app. Your device will automatically appear in your dashboard once it's online.",
  },
  {
    n: 4,
    title: "Configure your thresholds",
    body: "Set current and voltage limits in the dashboard. S.A.B.R.E. will alert you and trip the breaker if any limit is exceeded.",
  },
  {
    n: 5,
    title: "Monitor and control",
    body: "Use the dashboard to view live readings, manage breaker states, and review your circuit event history from anywhere.",
  },
];

export default function HomePage() {
  const [typedHeading, setTypedHeading] = useState("");
  useScrollReveal();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setTypedHeading(HOME_HEADING_TEXT);
      return;
    }

    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setTypedHeading(HOME_HEADING_TEXT.slice(0, index));

      if (index >= HOME_HEADING_TEXT.length) {
        window.clearInterval(intervalId);
      }
    }, 35);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="home-page-root">
      <div>
        <Navigation />
      </div>

      <Flex justify="center" className="home-page-content home-hero-section">
        <div className="home-hero-layout">
          <span className="small-title reveal-on-scroll" data-reveal-delay="0">
            S.A.B.R.E. - Smart Assessing Breaker for Residential Environments
          </span>

          <h1
            className="raleway-raleWay home-hero-heading reveal-on-scroll"
            aria-label={HOME_HEADING_TEXT}
            data-reveal-delay="100"
          >
            <span className="home-hero-heading-ghost" aria-hidden="true">
              {HOME_HEADING_TEXT}
            </span>
            <span className="home-hero-heading-typed" aria-hidden="true">
              {typedHeading}
              <span className="typing-cursor" aria-hidden="true">
                |
              </span>
            </span>
          </h1>

          <img
            src={breakerPhoto}
            alt="S.A.B.R.E. device"
            className="home-hero-image reveal-on-scroll"
            data-reveal-delay="180"
          />

          <p className="home-hero-copy reveal-on-scroll" data-reveal-delay="240">
            S.A.B.R.E. combines a smart circuit breaker device with a real-time web
            dashboard. Monitor power consumption, trip breakers remotely, and get
            instant alerts - all from your browser.
          </p>
        </div>
      </Flex>

      <Flex align="center" justify="center" className="home-page-content" direction="column">
        {/* Features */}
        <h2 className="home-section-title reveal-on-scroll">What S.A.B.R.E. does</h2>
        <Grid justify="center" gutter="12px" style={{ width: "100%" }}>
          {FEATURES.map(({ title, body }, index) => (
            <Grid.Col key={title} span={{ base: 12, xs: 6, md: 3 }}>
              <div
                className="feature-card reveal-on-scroll"
                data-reveal-delay={String(index * 60)}
                style={{ background: "#f7f7f7", borderRadius: "8px", padding: "1rem", height: "100%", 
                  display: "flex", flexDirection: "column", alignItems: "center"
                }}
              >
                <p style={{ fontSize: "13px", fontWeight: 500, margin: "0 0 6px"}}>{title}</p>
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, margin: 0 }}>{body}</p>
              </div>
            </Grid.Col>
          ))}
        </Grid>
      </Flex>

      {/* Setup steps */}
      <Flex
        align="center"
        justify="center"
        className="home-page-content"
        direction="column"
        style={{ padding: "2.5rem 2rem" }}
      >
        <h2 className="home-section-title reveal-on-scroll">How to set it up</h2>
        <Grid style={{ width: "100%" }}>
          {SETUP_STEPS.map(({ n, title, body }, i) => (
            <Grid.Col key={n} span={12}>
              <div
                className="setup-step-row reveal-on-scroll"
                data-reveal-delay={String(i * 45)}
                style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: i < SETUP_STEPS.length - 1 ? "1px solid #e5e5e5" : "none" }}
              >
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", background: "#e8f0fe",
                  color: "#091f4e", fontSize: "13px", fontWeight: 500,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px",
                }}>{n}</div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 4px" }}>{title}</p>
                  <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, margin: 0 }}>{body}</p>
                </div>
              </div>
            </Grid.Col>
          ))}
        </Grid>
      </Flex>

      

      






      <Background /> {/*come back and adjust the background on dis screen */}
    </div>
  );
}
