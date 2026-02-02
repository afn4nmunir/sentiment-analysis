import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MiniBarChart, MiniPieChart, Pill, SentimentPill } from "../components/Charts";

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [topicChartType, setTopicChartType] = useState('bar'); // 'bar' or 'pie'
  const [emotionChartType, setEmotionChartType] = useState('bar'); // Controls the second chart
  const [selectedSource, setSelectedSource] = useState('All');     // Controls the filter

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const API_URL = "/api/sentiment/all?limit=50"; 
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
        const [titlePart, bodyPart] = safeText.split("\n\n", 2);
        const title = titlePart?.trim() || item.Title || `Post #${index + 1}`;
        const body = bodyPart?.trim() || safeText;
        const postId = item.sourcePostId;
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
    // 1. Calculate Source Counts (Use ALL rows for this, so badges don't disappear)
    const sourceCounts = {};
    rows.forEach(r => {
      const src = r.Subreddit;
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
    // Sort sources by popularity (highest count first)
    const uniqueSources = Object.keys(sourceCounts).sort((a,b) => sourceCounts[b] - sourceCounts[a]);

    // 2. Filter Rows (This decides what shows in the Feed & Charts)
    const visibleRows = selectedSource === 'All' 
      ? rows 
      : rows.filter(r => r.Subreddit === selectedSource);

    // 3. Calculate Charts (Using only VISIBLE rows)
    const topicMap = {};
    const emotionMap = {};
    let posCount = 0;
    let negCount = 0;

    visibleRows.forEach(row => {
      // Count Topics
      const cat = row.Category || "Other";
      topicMap[cat] = (topicMap[cat] || 0) + 1;

      // Count Emotions
      const emo = row.Emotion || "Neutral";
      emotionMap[emo] = (emotionMap[emo] || 0) + 1;

      // Count Volume
      if (row.Sentiment > 0) posCount++;
      else if (row.Sentiment < 0) negCount++;
    });

    // Format Data for Charts
    const topics = Object.keys(topicMap)
      .map(key => ({ name: key, label: key, value: topicMap[key] }))
      .sort((a,b) => b.value - a.value).slice(0, 5);

    const emotions = Object.keys(emotionMap)
      .map(key => ({ name: key, label: key, value: emotionMap[key] }))
      .sort((a,b) => b.value - a.value).slice(0, 5);
    
    const total = posCount + negCount || 1;
    const volPos = Math.round((posCount / total) * 100);
    const volNeg = Math.round((negCount / total) * 100);

    return { 
      topics, emotions, volPos, volNeg, posCount, negCount, 
      uniqueSources, sourceCounts, visibleRows 
    };
  }, [rows, selectedSource]);

  return (
    <div className="fy-dashboard">
      
      <aside className="fy-left">
            <h3 style={{color: 'var(--brand)', marginTop: 0}}>InSight</h3>
        <div style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginTop: '20px', marginBottom: '10px'}}>
            DATA SOURCES ({stats.uniqueSources.length})
        </div>
        
        {/* 1. "All" Button */}
        <button 
          className={`fy-nav-item ${selectedSource === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedSource('All')}
        >
          <span>All Sources</span>
          <span className="count-badge">{rows.length}</span>
        </button>

        {/* 2. Dynamic Source List */}
        <div className="source-list">
            {stats.uniqueSources.map((source) => (
                <button 
                  key={source} 
                  className={`fy-nav-item ${selectedSource === source ? 'active' : ''}`}
                  onClick={() => setSelectedSource(source)}
                >
                    <span>{source}</span>
                    <span className="count-badge">{stats.sourceCounts[source]}</span>
                </button>
            ))}
        </div>
        
        <div className="admin-section">
            <div style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '10px'}}>ADMIN</div>
            <button onClick={handleLogout} className="fy-nav-item" style={{justifyContent: 'flex-start', color: 'var(--bad)'}}>
            Sign Out
            </button>
        </div>
      </aside>

      <main>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 style={{margin: 0}}>Active Intelligence</h2>
          <span style={{color: 'var(--muted)'}}>Showing {rows.length} insights</span>
        </div>

        {loading && <p>Loading intelligence...</p>}
        {error && <p style={{color: 'red'}}>Error: {error}</p>}

        {stats.visibleRows.map((row) => (
          <div key={row.id} className="fy-card">
            <div className="post-meta">
              <span className="post-source" style={{ 
                color: row.Sentiment > 0 ? 'var(--good)' : (row.Sentiment < 0 ? 'var(--bad)' : 'var(--muted)') 
              }}>
                ● <span style={{color: 'var(--muted)', marginLeft: '4px'}}>{row.Subreddit}</span>
              </span>
              <span>{row.Date}</span>
            </div>
            <div className="post-title">{row.Title}</div>
            <div className="post-body">{row.Body.substring(0, 200)}...</div>
            
            <div className="tag-container">
              <Pill label={row.Category} color="blue" />
              <SentimentPill score={row.Sentiment} />
              <Pill label={row.Emotion} color="gray" />
            </div>
          </div>
        ))}
      </main>

      <aside className="fy-right">
        
        <div className="fy-panel">
          <div className="chart-header">
            <span>Topic Distribution</span>
              <div className="toggle-group" style={{background: '#f1f5f9', padding: '2px', borderRadius: '6px', display: 'flex'}}>
                <button 
                    onClick={() => setTopicChartType('bar')}
                    style={toggleStyle(topicChartType, 'bar')}
                >
                    Bar
                </button>
                <button 
                    onClick={() => setTopicChartType('pie')}
                    style={toggleStyle(topicChartType, 'pie')}
                >
                    Pie
                </button>
            </div>
          </div>
          
          <div style={{height: '180px', width: '100%'}}>
             {topicChartType === 'bar' ? (
                 <MiniBarChart data={stats.topics} />
             ) : (
                 <MiniPieChart data={stats.topics} />
             )}
          </div>
        </div>

        <div className="fy-panel">
           <div className="chart-header">
            <span>Emotional Landscape</span>
            
            <div className="toggle-group" style={{background: '#f1f5f9', padding: '2px', borderRadius: '6px', display: 'flex'}}>
                <button 
                  onClick={() => setEmotionChartType('bar')} 
                  style={toggleStyle(emotionChartType, 'bar')}
                >Bar</button>
                <button 
                  onClick={() => setEmotionChartType('pie')} 
                  style={toggleStyle(emotionChartType, 'pie')}
                >Pie</button>
            </div>
          </div>

           <div style={{height: '180px', width: '100%'}}>
             {emotionChartType === 'bar' 
               ? <MiniBarChart data={stats.emotions} /> 
               : <MiniPieChart data={stats.emotions} />
             }
           </div>
        </div>

        <div className="fy-panel" style={{background: '#1e293b', color: 'white'}}>
          <div style={{fontWeight: 'bold', marginBottom: '10px'}}>Sentiment Volume</div>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
             
             <div style={{flex: 1, background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px'}}>
                <span style={{fontSize: '1.8rem', fontWeight: 800, color: '#34d399', display: 'block', lineHeight: 1}}>
                  {stats.posCount}
                </span>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px'}}>
                    <span style={{fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7}}>Positive</span>
                    <span style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#34d399'}}>{stats.volPos}%</span>
                </div>
             </div>

             <div style={{flex: 1, background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px'}}>
                <span style={{fontSize: '1.8rem', fontWeight: 800, color: '#f87171', display: 'block', lineHeight: 1}}>
                  {stats.negCount}
                </span>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px'}}>
                    <span style={{fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7}}>Negative</span>
                    <span style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#f87171'}}>{stats.volNeg}%</span>
                </div>
             </div>

          </div>
        </div>
      </aside>

    </div>
  );
}