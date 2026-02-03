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
};

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
        {data.slice(0, 5).map((slice, i) => {
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
        {data.slice(0, 5).map((d, i) => (
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

export function MiniTrendChart({ data, keys = [] }) {
  if (!data || data.length < 2) return <div style={{ fontSize: 12, color: "#94a3b8" }}>Not enough data for trend</div>;

  // Configuration
  const width = 300;
  const height = 150;
  const padding = 20;
  const graphWidth = width;
  const graphHeight = height - padding;

  // Colors matching your Pie Chart palette
  const palette = {
    neutral: "#2563eb",   // Blue
    stress: "#7c3aed",    // Purple
    happy: "#10b981",     // Green
    confusion: "#f59e0b", // Orange
    frustration: "#ef4444" // Red
  };
  const fallbackColors = ["#2563eb", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b"];

  // 1. Find Max Value for Y-Scaling
  let maxValue = 0;
  data.forEach(d => {
    keys.forEach(k => {
      if (d[k] > maxValue) maxValue = d[k];
    });
  });
  if (maxValue === 0) maxValue = 1; // Prevent divide by zero

  // 2. Helper to get coordinates
  const getX = (index) => (index / (data.length - 1)) * graphWidth;
  const getY = (value) => graphHeight - ((value / maxValue) * graphHeight) + 5; // +5 padding top

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Background Grid Lines */}
        <line x1="0" y1={graphHeight} x2={width} y2={graphHeight} stroke="#e2e8f0" strokeWidth="1" />
        <line x1="0" y1={0} x2={width} y2={0} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

        {/* Draw Lines */}
        {keys.map((key, kIndex) => {
          const color = palette[key.toLowerCase()] || fallbackColors[kIndex % fallbackColors.length];
          
          // Generate SVG Path
          const points = data.map((d, i) => `${getX(i)},${getY(d[key] || 0)}`).join(" ");

          return (
            <g key={key}>
              {/* The Line */}
              <polyline 
                points={points} 
                fill="none" 
                stroke={color} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* The Dots */}
              {data.map((d, i) => (
                <circle 
                  key={i} 
                  cx={getX(i)} 
                  cy={getY(d[key] || 0)} 
                  r="2" 
                  fill="white" 
                  stroke={color} 
                  strokeWidth="1.5" 
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* X-Axis Labels (Dates) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#94a3b8' }}>
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10, justifyContent: 'center' }}>
        {keys.map((key, i) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: '#475569' }}>
            <span style={{ 
              width: 8, height: 8, borderRadius: '50%', marginRight: 6,
              background: palette[key.toLowerCase()] || fallbackColors[i % fallbackColors.length] 
            }} />
            <span style={{ textTransform: 'capitalize' }}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}