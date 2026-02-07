import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MiniBarChart, MiniPieChart, Pill, SentimentPill, MiniTrendChart, SentimentBreakdownChart, BigTrendChart } from "../components/Charts";
import PostModal from '../components/PostModal';
import ChartModal from '../components/ChartModal';

export default function Dashboard() {
  const PREVIEW_LENGTH = 200;

  const IGNORED_SOURCES = [
    "TemasekPoly",
    "SingaporePoly",
    "NgeeAnnPoly",
    "nanyangpoly",
    "republicpolytechnic",
    "NYP",
  ];

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topicChartType, setTopicChartType] = useState('bar');
  const [emotionChartType, setEmotionChartType] = useState('bar');
  const [selectedSource, setSelectedSource] = useState('All');

  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedChart, setExpandedChart] = useState(null);

  const [mobileView, setMobileView] = useState('feed');

  const [searchQuery, setSearchQuery] = useState('');


  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const API_URL = "/api/sentiment/all?limit=1000";
    const API_KEY = import.meta.env.VITE_API_KEY;

    fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json", "x-api-token": API_KEY }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(apiData => {
        let rawList = [];
        if (apiData.items && Array.isArray(apiData.items)) rawList = apiData.items;
        else if (Array.isArray(apiData)) rawList = apiData;

        const cleanRows = rawList.map((item, index) => {
          const safeText = String(item.CombinedText || item.text || item.body || "");
          const parts = safeText.split("\n\n");
          const title = parts[0]?.trim() || item.Title || `Post #${index + 1}`;
          const body = parts.slice(1).join("\n\n").trim() || safeText;
          const postId = item.SourcePostId;
          const redditUrl = postId ? `https://www.reddit.com/comments/${postId}/` : null;
          const safeDate = item.ProcessedAt ? new Date(item.ProcessedAt * 1000) : new Date();
          return {
            id: index,
            redditUrl,
            Subreddit: item.Subreddit || item.subreddit || "Unknown",
            Category: item.Category || item.category || "Other",
            Body: body,
            Sentiment: parseFloat(item.Sentiment || item.sentiment || 0),
            Emotion: item.Emotion || item.emotion || "neutral",
            Date: safeDate.toLocaleDateString(),
            Title: title
          };
        });
        setRows(cleanRows);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleStyle = (current, type) => ({
    padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold',
    background: current === type ? 'white' : 'transparent',
    color: current === type ? 'var(--brand)' : '#64748b',
    boxShadow: current === type ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
  });

  const stats = useMemo(() => {
    const activeRows = rows.filter(r => !IGNORED_SOURCES.includes(r.Subreddit));

    const searchFilteredRows = searchQuery.trim()
      ? activeRows.filter(r => {
        const q = searchQuery.toLowerCase();
        return (
          r.Title?.toLowerCase().includes(q) ||
          r.Body?.toLowerCase().includes(q) ||
          r.Subreddit?.toLowerCase().includes(q) ||
          r.Category?.toLowerCase().includes(q) ||
          r.Emotion?.toLowerCase().includes(q)
        );
      })
      : activeRows;

    const sourceCounts = {};
    searchFilteredRows.forEach(r => {
      const src = r.Subreddit;
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });

    const uniqueSources = Object.keys(sourceCounts).sort((a, b) => sourceCounts[b] - sourceCounts[a]);

    const visibleRows =
      selectedSource === 'All'
        ? searchFilteredRows
        : searchFilteredRows.filter(r => r.Subreddit === selectedSource);

    const topicMap = {};
    const emotionMap = {};
    let posCount = 0;
    let negCount = 0;

    visibleRows.forEach(row => {
      const cat = row.Category || "Other";
      topicMap[cat] = (topicMap[cat] || 0) + 1;
      const emo = row.Emotion || "Neutral";
      emotionMap[emo] = (emotionMap[emo] || 0) + 1;
      if (row.Sentiment > 0) posCount++;
      else if (row.Sentiment < 0) negCount++;
    });

    const topics = Object.keys(topicMap)
      .map(key => ({ name: key, label: key, value: topicMap[key] }))
      .sort((a, b) => b.value - a.value).slice(0, 5);

    const emotions = Object.keys(emotionMap)
      .map(key => ({ name: key, label: key, value: emotionMap[key] }))
      .sort((a, b) => b.value - a.value).slice(0, 5);

    const volPos = Math.round((posCount / (posCount + negCount || 1)) * 100);
    const volNeg = Math.round((negCount / (posCount + negCount || 1)) * 100);

    const timeMap = {};
    visibleRows.forEach(row => {
      const dateObj = new Date(row.Date);
      if (!isNaN(dateObj)) {
        const dateKey = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        if (!timeMap[dateKey]) {
          timeMap[dateKey] = { date: dateKey, positive: 0, negative: 0, stress: 0, happy: 0, confusion: 0, frustration: 0 };
        }
        if (row.Sentiment > 0) timeMap[dateKey].positive++;
        else if (row.Sentiment < 0) timeMap[dateKey].negative++;
        const emo = (row.Emotion || "").toLowerCase();
        if (timeMap[dateKey][emo] !== undefined) timeMap[dateKey][emo]++;
        else timeMap[dateKey][emo] = 1;
      }
    });

    const trendData = Object.values(timeMap).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      topics, emotions, volPos, volNeg, posCount, negCount,
      uniqueSources, sourceCounts, visibleRows, trendData
    };
  }, [rows, selectedSource, searchQuery]);

  return (
    <div className="fy-dashboard">

      {/* 1. LEFT SIDEBAR (Sources) */}
      <aside className={`fy-left ${mobileView === 'sources' ? 'active-mobile' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          {/* The Logo Image */}
          <img src="/InSight-Logo.png" alt="InSight-Logo" style={{ width: '40px', height: '40px' }} />

          {/* The Text */}
          <h1 style={{
            color: 'var(--brand)',
            margin: 0,
            fontSize: '2rem',
            fontWeight: '800',
            letterSpacing: '-1px'
          }}>
            InSight
          </h1>
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginTop: '20px', marginBottom: '10px' }}>
          DATA SOURCES ({stats.uniqueSources.length})
        </div>
        <button
          className={`fy-nav-item ${selectedSource === 'All' ? 'active' : ''}`}
          onClick={() => { setSelectedSource('All'); setMobileView('feed'); }}
        >
          <span>All Sources</span>
          <span className="count-badge">{stats.uniqueSources.reduce((acc, src) => acc + stats.sourceCounts[src], 0)}</span>
        </button>
        <div className="source-list">
          {stats.uniqueSources.map((source) => (
            <button
              key={source}
              className={`fy-nav-item ${selectedSource === source ? 'active' : ''}`}
              onClick={() => { setSelectedSource(source); setMobileView('feed'); }}
            >
              <span>{source}</span>
              <span className="count-badge">{stats.sourceCounts[source]}</span>
            </button>
          ))}
        </div>
        <div className="admin-section">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '10px' }}>ADMIN</div>
          <button onClick={handleLogout} className="fy-nav-item" style={{ justifyContent: 'flex-start', color: 'var(--bad)' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. CENTER MAIN (Feed) - Has class 'active-mobile' if active */}
      <main className={`${mobileView === 'feed' ? 'active-mobile' : ''}`}>
        <div className="feed-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>Active Intelligence</h2>
            <span style={{ color: 'var(--muted)' }}>{stats.visibleRows.length} insights</span>
          </div>

          <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search posts, keywords, or sources…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                marginTop: '1px',
                width: '100%',
                padding: '10px 40px 10px 24px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.9rem',
                outline: 'none',
                background: 'var(--panel)',
              }}
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                title="Clear search"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: 'var(--muted)',
                  padding: 0,
                }}
              >
                🔄
              </button>
            )}
          </div>
        </div>

        {loading && <p>Loading intelligence...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && stats.visibleRows.length === 0 && (
          <p style={{ color: 'var(--muted)', marginTop: '20px' }}>
            No posts match your search.
          </p>
        )}

        {stats.visibleRows.map((row) => (
          <div key={row.id} className="fy-card" onClick={() => setSelectedPost(row)} style={{ cursor: 'pointer', transition: 'transform 0.1s' }}>
            <div className="post-meta">
              <span className="post-source" style={{
                color: row.Sentiment > 0 ? 'var(--good)' : (row.Sentiment < 0 ? 'var(--bad)' : 'var(--muted)')
              }}>
                ● <span style={{ color: 'var(--muted)', marginLeft: '4px' }}>{row.Subreddit}</span>
              </span>
              <span>{row.Date}</span>
            </div>
            <div className="post-title">{row.Title}</div>
            <div className="post-body">{row.Body.length > PREVIEW_LENGTH
              ? `${row.Body.slice(0, PREVIEW_LENGTH)}...`
              : row.Body}</div>
            <div className="tag-container">
              <Pill label={row.Category} color="blue" />
              <SentimentPill score={row.Sentiment} />
              <Pill label={row.Emotion} color="gray" />
            </div>
          </div>
        ))}
        <div style={{ height: '80px' }}></div>
      </main>

      {/* 3. RIGHT SIDEBAR (Analytics) */}
      <aside className={`fy-right ${mobileView === 'analytics' ? 'active-mobile' : ''}`}>
        <div className="fy-panel">
          <div className="chart-header">
            <span>Topic Distribution</span>
            <div className="toggle-group" style={{ background: '#f1f5f9', padding: '2px', borderRadius: '6px', display: 'flex' }}>
              <button onClick={() => setTopicChartType('bar')} style={toggleStyle(topicChartType, 'bar')}>Bar</button>
              <button onClick={() => setTopicChartType('pie')} style={toggleStyle(topicChartType, 'pie')}>Pie</button>
            </div>
          </div>
          <div style={{ height: '180px', width: '100%' }}>
            {topicChartType === 'bar' ? <MiniBarChart data={stats.topics} /> : <MiniPieChart data={stats.topics} />}
          </div>
        </div>

        <div className="fy-panel" style={{ cursor: 'pointer' }} onClick={() => setExpandedChart('emotion')}>
          <div className="chart-header">
            <span>Emotional Landscape</span>
            <div className="toggle-group" style={{ background: '#f1f5f9', padding: '2px', borderRadius: '6px', display: 'flex' }}>
              <button onClick={(e) => { e.stopPropagation(); setEmotionChartType('bar'); }} style={toggleStyle(emotionChartType, 'bar')}>Bar</button>
              <button onClick={(e) => { e.stopPropagation(); setEmotionChartType('pie'); }} style={toggleStyle(emotionChartType, 'pie')}>Pie</button>
              <button onClick={(e) => { e.stopPropagation(); setEmotionChartType('trend'); }} style={toggleStyle(emotionChartType, 'trend')}>Trend</button>
            </div>
            <button style={{ marginLeft: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>⤢</button>
          </div>
          <div style={{ minHeight: '180px', width: '100%' }}>
            {emotionChartType === 'bar' && <MiniBarChart data={stats.emotions} color="#7c3aed" />}
            {emotionChartType === 'pie' && <MiniPieChart data={stats.emotions} />}
            {emotionChartType === 'trend' && <MiniTrendChart data={stats.trendData} keys={stats.emotions.slice(0, 5).map(e => e.name)} />}
          </div>
        </div>

        <div className="fy-panel" style={{ background: '#1e293b', color: 'white', cursor: 'pointer' }} onClick={() => setExpandedChart('sentiment')}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Sentiment Volume</span>
            <span>⤢</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', display: 'block', lineHeight: 1 }}>{stats.posCount}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7 }}>Positive</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#34d399' }}>{stats.volPos}%</span>
              </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', display: 'block', lineHeight: 1 }}>{stats.negCount}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7 }}>Negative</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f87171' }}>{stats.volNeg}%</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: '80px' }}></div>
      </aside>

      <div className="mobile-nav">
        <button
          className={mobileView === 'sources' ? 'active' : ''}
          onClick={() => setMobileView('sources')}
        >
          Sources
        </button>
        <button
          className={mobileView === 'feed' ? 'active' : ''}
          onClick={() => setMobileView('feed')}
        >
          Feed
        </button>
        <button
          className={mobileView === 'analytics' ? 'active' : ''}
          onClick={() => setMobileView('analytics')}
        >
          Analytics
        </button>
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      {expandedChart === 'emotion' && (
        <ChartModal title="Emotional Landscape Analytics" onClose={() => setExpandedChart(null)}>
          <h4 style={{ marginTop: 0, color: '#64748b' }}>Trend Analysis (Expanded View)</h4>
          <BigTrendChart
            data={stats.trendData}
            keys={stats.emotions.slice(0, 5).map(e => e.name)}
          />
        </ChartModal>
      )}
      {expandedChart === 'sentiment' && (
        <ChartModal title="Sentiment Breakdown by Post" onClose={() => setExpandedChart(null)} theme="dark">
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            Visualizing the positive vs negative impact of the last 30 posts.
          </p>
          <SentimentBreakdownChart data={stats.visibleRows} />
        </ChartModal>
      )}
    </div>
  );
}