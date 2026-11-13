import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "YottaBuilder — From Client Requirements to Production App";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const logo = await readFile(path.join(process.cwd(), "public/brand/yottabuilder-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const steps = ["Requirements", "Context", "Epics", "Stories", "Tests", "Tasks", "Code"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(900px 500px at 85% 0%, rgba(34,195,201,0.45), transparent 60%), linear-gradient(160deg, #121417 0%, #0a0b0d 70%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={364} height={57} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2.5, maxWidth: 980 }}>From Client Requirements to Production App.</div>
          <div style={{ marginTop: 26, fontSize: 30, color: "#9aa1ac" }}>AI-powered. Human-led. Production-ready.</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 22, color: "#9aa1ac" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: i === steps.length - 1 ? "#3dd68c" : "#ffffff" }}>{s}</span>
              {i < steps.length - 1 && <span style={{ color: i === 3 ? "#e8a33d" : "#22c3c9" }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
