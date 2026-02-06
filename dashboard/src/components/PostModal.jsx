// src/components/PostModal.jsx
import React from 'react';

export default function PostModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999 
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'white', 
        width: '90%', maxWidth: '700px', 
        maxHeight: '85vh', 
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}> 

        <div style={{
          padding: '20px 25px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: '#f8fafc'
        }}>
           <div>
              <span style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase'}}>
                {post.Subreddit} • {post.Date}
              </span>
           </div>
           <button onClick={onClose} style={{
             border: 'none', background: 'transparent', fontSize: '1.5rem', 
             cursor: 'pointer', color: '#94a3b8', padding: '0 5px'
           }}>×</button>
        </div>

        <div style={{padding: '30px', overflowY: 'auto'}}>
           <h2 style={{marginTop: 0, marginBottom: '20px', color: '#1e293b', fontSize: '1.5rem'}}>
             {post.Title}
           </h2>
           <div style={{marginTop: 0, marginBottom: '20px', color: '#1e293b', fontSize: '1rem'}}>
             {post.redditUrl && (
                <a href={post.redditUrl} target="_blank" rel="noopener noreferrer">View on Reddit</a>
              )}
           </div>
           
           <div style={{
             fontSize: '1rem', lineHeight: '1.7', color: '#334155', 
             whiteSpace: 'pre-wrap'
           }}>
             {post.Body}
           </div>
        </div>

        <div style={{
          padding: '20px 25px', 
          borderTop: '1px solid #e5e7eb',
          display: 'flex', gap: '10px',
          backgroundColor: '#fff'
        }}>
           <span style={{background: '#dbeafe', color: '#1e40af', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500'}}>
             {post.Category}
           </span>
           <span style={{
             background: post.Sentiment > 0 ? '#dcfce7' : (post.Sentiment < 0 ? '#fee2e2' : '#f3f4f6'),
             color: post.Sentiment > 0 ? '#166534' : (post.Sentiment < 0 ? '#991b1b' : '#374151'),
             padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500'
           }}>
             {post.Sentiment > 0 ? 'Positive' : (post.Sentiment < 0 ? 'Negative' : 'Neutral')}
           </span>
        </div>

      </div>
    </div>
  );
}