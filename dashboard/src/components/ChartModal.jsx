import React from 'react';

export default function ChartModal({ title, onClose, children, theme = 'light' }) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1e293b' : 'white';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const closeBtnColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: bgColor, 
        color: textColor,
        width: '95%', maxWidth: '1200px', 
        height: 'auto', maxHeight: '90vh',
        borderRadius: '16px', padding: '30px', position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexShrink: 0 }}>
          <h2 style={{ margin: 0, color: 'inherit' }}>{title}</h2>
          <button onClick={onClose} style={{
             border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: closeBtnColor
          }}>×</button>
        </div>

        <div style={{ width: '100%', flex: 1, minHeight: '500px', overflowY: 'auto' }}>
          {children}
        </div>

      </div>
    </div>
  );
}