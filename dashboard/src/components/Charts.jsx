import React from "react";

// --- Sub-components for Styling ---
export function Pill({ label, type = "neu" }) {
  const colors = {
    brand: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" }, // Blue
    brand2: { bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" }, // Purple
    neu: { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" },    // Grey
  };
  const c = colors[type] || colors.neu;

  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 600,
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      whiteSpace: "nowrap"
    }}>
      {label}
    </span>
  );
}

export function SentimentPill({ score }) {
  let color = "#94a3b8"; // Neutral grey
  let label = "Neutral";
  
  if (score > 0) {
    color = "#10b981"; // Green
    label = "Positive";
  } else if (score < 0) {
    color = "#ef4444"; // Red
    label = "Negative";
  }

  return (
    <span style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: "12px", fontWeight: 700, color: color
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }}></span>
      {label}
    </span>
  );
}

// --- Charts ---

export function MiniBarChart({ data, color = "#2563eb" }) {
  if (!data || data.length === 0) return <div style={{ fontSize: 12, color: "#94a3b8" }}>No data</div>;

  const max = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.slice(0, 5).map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
          <div style={{ width: 80, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {d.label}
          </div>
          <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3, margin: "0 8px" }}>
            <div
              style={{
                width: `${(d.value / max) * 100}%`,
                height: "100%",
                background: color,
                borderRadius: 3,
                transition: "width 0.5s ease"
              }}
            />
          </div>
          <div style={{ width: 24, textAlign: "right", fontWeight: 600, color: "#334155" }}>
            {d.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MiniPieChart({ data }) {
  if (!data || data.length === 0) return <div style={{ fontSize: 12, color: "#94a3b8" }}>No data</div>;

  // Simple SVG Pie Chart logic
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  let accumulatedAngle = 0;

  // Modern Palette
  const palette = ["#2563eb", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* The Pie SVG */}
      <svg width="100" height="100" viewBox="-1 -1 2 2" style={{ transform: "rotate(-90deg)" }}>
        {data.slice(0, 6).map((slice, i) => {
          const sliceAngle = (slice.value / total) * 2 * Math.PI;
          const x1 = Math.cos(accumulatedAngle);
          const y1 = Math.sin(accumulatedAngle);
          const x2 = Math.cos(accumulatedAngle + sliceAngle);
          const y2 = Math.sin(accumulatedAngle + sliceAngle);
          
          const isLargeArc = sliceAngle > Math.PI ? 1 : 0;
          
          const d = [
            `M 0 0`,
            `L ${x1} ${y1}`,
            `A 1 1 0 ${isLargeArc} 1 ${x2} ${y2}`,
            `Z`
          ].join(" ");

          const path = <path d={d} fill={palette[i % palette.length]} stroke="white" strokeWidth="0.05" key={i} />;
          accumulatedAngle += sliceAngle;
          return path;
        })}
      </svg>

      {/* The Legend */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data.slice(0, 4).map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: '#475569' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: palette[i % palette.length], marginRight: 6 }} />
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</span>
            <span style={{ fontWeight: 700 }}>{Math.round((d.value/total)*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}