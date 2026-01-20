import React, { useEffect, useMemo, useState } from "react";
import { loadResultsCsv } from "../utils/loadcsv";
import { MiniBarChart, MiniPieChart, Pill, SentimentPill } from "../components/Charts";
import Topbar from "../components/Topbar";

// --- Helpers
const cleanSentiment = (val) => {
  if (!val) return 0;
  // Remove quotes and convert to float
  return parseFloat(String(val).replace(/['"]/g, ""));
};

const extractContent = (combinedText) => {
  if (!combinedText) return { title: "Untitled", body: "" };
  // Split by literal "\n" sequence because that's how it is in the CSV
  const parts = combinedText.split(/\\n|\n/); 
  const title = parts[0].replace(/^"|"$/g, '').trim(); 
  const body = parts.slice(1).join(" ").replace(/^"|"$/g, '').trim();
  return { title: title || "Untitled Post", body };
};

const getGroupedData = (rows, key) => {
  const counts = {};
  rows.forEach(r => {
    const val = r[key] || "Unknown";
    counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState("All");
  const [chartMode, setChartMode] = useState("bar"); 

useEffect(() => {
    // 1. URL for the Proxy
    const API_URL = "/api/sentiment/all?limit=50"; 
    
    // 2. LOAD KEY FROM ENV
    // This grabs the value you defined as VITE_API_KEY in the .env file
    const API_KEY = import.meta.env.VITE_API_KEY;

    // Safety Debug: Check if it loaded (Remove this line after it works)
    console.log("🔑 Loaded Key Length:", API_KEY ? API_KEY.length : "MISSING");

    setLoading(true);

    fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY // Passes the loaded key
      }
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(apiData => {
      
      const cleanRows = apiData.map(item => ({
        Subreddit: item.subreddit || item.Subreddit || "Unknown", 
        Category: item.category || item.Category || "General",
        CombinedText: item.text || item.body || item.CombinedText || "", 
        Sentiment: parseFloat(item.sentiment || item.Sentiment || 0),
        Emotion: item.emotion || item.Emotion || "neutral",
        ProcessedAt: item.created_at ? new Date(item.created_at) : new Date(),
        Title: item.title || item.Title || "Untitled Post",
        Body: item.text || item.body || ""
      }));

      setRows(cleanRows);
      setLoading(false);
    })
    .catch(err => {
      console.error("❌ API Fetch Failed:", err);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return activeSub === "All" ? rows : rows.filter(r => r.Subreddit === activeSub);
  }, [rows, activeSub]);

  // Derived Analytics
  const subreddits = useMemo(() => {
    const list = getGroupedData(rows, "Subreddit");
    return [{ label: "All", value: rows.length }, ...list];
  }, [rows]);

  const categoryStats = useMemo(() => getGroupedData(filtered, "Category"), [filtered]);
  const emotionStats = useMemo(() => getGroupedData(filtered, "Emotion"), [filtered]);

  const sentimentSummary = useMemo(() => {
    const pos = filtered.filter(r => r.Sentiment > 0).length;
    const neg = filtered.filter(r => r.Sentiment < 0).length;
    return { pos, neg, neu: filtered.length - pos - neg };
  }, [filtered]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading Project Data...</div>;

  return (
    <div className="dashboard-shell">
      <Topbar title={`Workspace: ${activeSub}`} />

      <main className="fy-dashboard">
        {/* LEFT: ENTITIES */}
        <aside className="fy-left">
          <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--muted)', marginBottom: 16, textTransform: 'uppercase' }}>
            Data Sources
          </div>
          {subreddits.map(s => (
            <div 
              key={s.label} 
              className={`fy-nav-item ${activeSub === s.label ? 'active' : ''}`}
              onClick={() => setActiveSub(s.label)}
            >
              <span>{s.label}</span>
              <span className="count-badge">{s.value}</span>
            </div>
          ))}
        </aside>

        {/* CENTER: FEED */}
        <section className="fy-feed">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Active Intelligence</h3>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>Showing {filtered.length} insights</span>
          </div>

          {filtered.map((r, i) => (
            <div key={i} className="fy-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   {/* Sentiment Indicator Dot */}
                  <div style={{ 
                    width: 10, height: 10, borderRadius: '50%', 
                    background: r.Sentiment > 0 ? 'var(--good)' : r.Sentiment < 0 ? 'var(--bad)' : 'var(--neu)' 
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {r.Subreddit}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {r.ProcessedAt.toLocaleDateString()}
                </span>
              </div>

              {/* THE TITLE IS NOW HERE */}
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: 'var(--text)' }}>
                {r.Title}
              </div>
              
              <div style={{ fontSize: 14, lineHeight: 1.5, color: '#475569', marginBottom: 16 }}>
                {r.Body.substring(0, 200)}...
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <Pill label={r.Category} type="brand" />
                <SentimentPill score={r.Sentiment} />
                <Pill label={r.Emotion} type="neu" />
              </div>
            </div>
          ))}
        </section>

        {/* RIGHT: ANALYTICS */}
        <aside className="fy-right">
          <div className="fy-panel">
            <div className="chart-header">
              <span style={{ fontWeight: 700 }}>Topic Distribution</span>
              <div className="toggle-group">
                <button className={`toggle-btn ${chartMode === 'bar' ? 'active' : ''}`} onClick={() => setChartMode('bar')}>Bar</button>
                <button className={`toggle-btn ${chartMode === 'pie' ? 'active' : ''}`} onClick={() => setChartMode('pie')}>Pie</button>
              </div>
            </div>
            {chartMode === 'bar' ? (
              <MiniBarChart data={categoryStats} color="var(--brand)" />
            ) : (
              <MiniPieChart data={categoryStats} />
            )}
          </div>

          <div className="fy-panel">
            <div className="chart-header">
              <span style={{ fontWeight: 700 }}>Emotional Landscape</span>
            </div>
            {chartMode === 'bar' ? (
              <MiniBarChart data={emotionStats} color="var(--brand2)" />
            ) : (
              <MiniPieChart data={emotionStats} />
            )}
          </div>

          <div className="fy-panel" style={{ background: 'var(--text)', color: 'white' }}>
            <span style={{ fontWeight: 700, display: 'block', marginBottom: 16 }}>Sentiment Volume</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 10, opacity: 0.7 }}>POSITIVE</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--good)' }}>{sentimentSummary.pos}</div>
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 10, opacity: 0.7 }}>NEGATIVE</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--bad)' }}>{sentimentSummary.neg}</div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}