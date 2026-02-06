import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';

export function Pill({ label, type = "neu" }) {
  const colors = {
    brand: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" }, 
    brand2: { bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" }, 
    neu: { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" },    
  };
  const c = colors[type] || colors.neu;

  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
      backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`, whiteSpace: "nowrap"
    }}>
      {label}
    </span>
  );
}

export function SentimentPill({ score }) {
  let color = "#94a3b8"; 
  let label = "Neutral";
  if (score > 0) { color = "#10b981"; label = "Positive"; } 
  else if (score < 0) { color = "#ef4444"; label = "Negative"; }

  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 700, color: color }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }}></span>
      {label}
    </span>
  );
}

export function MiniBarChart({ data, color = "#2563eb" }) {
  if (!data || data.length === 0) return <div style={{ fontSize: 12, color: "#94a3b8" }}>No data</div>;
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.slice(0, 5).map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
          <div style={{ width: 80, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.label}</div>
          <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3, margin: "0 8px" }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ width: 24, textAlign: "right", fontWeight: 600, color: "#334155" }}>{d.value}</div>
        </div>
      ))}
    </div>
  );
};

export function MiniPieChart({ data }) {
  if (!data || data.length === 0) return <div style={{ fontSize: 12, color: "#94a3b8" }}>No data</div>;
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  let accumulatedAngle = 0;
  const palette = ["#2563eb", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width="100" height="100" viewBox="-1 -1 2 2" style={{ transform: "rotate(-90deg)" }}>
        {data.slice(0, 5).map((slice, i) => {
          const sliceAngle = (slice.value / total) * 2 * Math.PI;
          const x1 = Math.cos(accumulatedAngle);
          const y1 = Math.sin(accumulatedAngle);
          const x2 = Math.cos(accumulatedAngle + sliceAngle);
          const y2 = Math.sin(accumulatedAngle + sliceAngle);
          const isLargeArc = sliceAngle > Math.PI ? 1 : 0;
          const d = [`M 0 0`, `L ${x1} ${y1}`, `A 1 1 0 ${isLargeArc} 1 ${x2} ${y2}`, `Z`].join(" ");
          const path = <path d={d} fill={palette[i % palette.length]} stroke="white" strokeWidth="0.05" key={i} />;
          accumulatedAngle += sliceAngle;
          return path;
        })}
      </svg>
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
  const width = 300; const height = 150; const padding = 20; const graphWidth = width; const graphHeight = height - padding;
  const palette = { neutral: "#2563eb", stress: "#7c3aed", happy: "#10b981", confusion: "#f59e0b", frustration: "#ef4444" };
  const fallbackColors = ["#2563eb", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b"];
  let maxValue = 0;
  data.forEach(d => { keys.forEach(k => { if (d[k] > maxValue) maxValue = d[k]; }); });
  if (maxValue === 0) maxValue = 1;
  const getX = (index) => (index / (data.length - 1)) * graphWidth;
  const getY = (value) => graphHeight - ((value / maxValue) * graphHeight) + 5;
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <line x1="0" y1={graphHeight} x2={width} y2={graphHeight} stroke="#e2e8f0" strokeWidth="1" />
        <line x1="0" y1={0} x2={width} y2={0} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
        {keys.map((key, kIndex) => {
          const color = palette[key.toLowerCase()] || fallbackColors[kIndex % fallbackColors.length];
          const points = data.map((d, i) => `${getX(i)},${getY(d[key] || 0)}`).join(" ");
          return (
            <g key={key}>
              <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {data.map((d, i) => ( <circle key={i} cx={getX(i)} cy={getY(d[key] || 0)} r="2" fill="white" stroke={color} strokeWidth="1.5" /> ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#94a3b8' }}>
        <span>{data[0]?.date}</span><span>{data[data.length - 1]?.date}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10, justifyContent: 'center' }}>
        {keys.map((key, i) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: '#475569' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', marginRight: 6, background: palette[key.toLowerCase()] || fallbackColors[i % fallbackColors.length] }} />
            <span style={{ textTransform: 'capitalize' }}>{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export function BigTrendChart({ data, keys }) {
  const palette = { neutral: "#2563eb", stress: "#7c3aed", happy: "#10b981", confusion: "#f59e0b", frustration: "#ef4444" };
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];
  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" style={{ fontSize: '12px' }} />
          <YAxis style={{ fontSize: '12px' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {keys.map((key, i) => (
             <Line key={key} type="monotone" dataKey={key.toLowerCase()} stroke={palette[key.toLowerCase()] || colors[i % colors.length]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SentimentBreakdownChart({ data }) {
  const chartData = data.slice(0, 30).map(row => ({
    name: row.Title.length > 20 ? row.Title.substring(0, 20) + '...' : row.Title,
    fullTitle: row.Title,
    positive: row.Sentiment > 0 ? row.Sentiment : 0,
    negative: row.Sentiment < 0 ? row.Sentiment : 0, 
  }));

  return (
    <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} stackOffset="sign" margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} style={{ fontSize: '10px' }} tick={{ fill: '#cbd5e1' }} />
          <YAxis style={{ fontSize: '12px' }} tick={{ fill: '#cbd5e1' }} />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.1)'}}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div style={{ background: 'white', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', maxWidth: '300px', color: '#1e293b' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>{item.fullTitle}</p>
                    <p style={{ color: '#10b981', fontSize: '12px', margin: 0 }}>Positive: {item.positive.toFixed(2)}</p>
                    <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>Negative: {item.negative.toFixed(2)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', color: '#cbd5e1' }}/>
          <ReferenceLine y={0} stroke="#94a3b8" />
          <Bar dataKey="positive" name="Positive Sentiment" fill="#2dd4bf" barSize={20} radius={[4, 4, 0, 0]} />
          <Bar dataKey="negative" name="Negative Sentiment" fill="#f43f5e" barSize={20} radius={[0, 0, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}