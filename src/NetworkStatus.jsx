import React, { useEffect, useState } from 'react';

function getNetworkInfo() {
  const nav = navigator;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (!connection) {
    return { type: 'unknown', effectiveType: 'unknown', downlink: 'unknown', rtt: 'unknown', online: nav.onLine };
  }
  return {
    type: connection.type || 'unknown',
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 'unknown',
    rtt: connection.rtt || 'unknown',
    online: nav.onLine
  };
}

function getStatusColor(network) {
  if (!network.online) return 'red';
  if (network.effectiveType === '2g' || network.effectiveType === 'slow-2g' || network.downlink < 1) return 'yellow';
  return 'green';
}

export default function NetworkStatus() {
  const [network, setNetwork] = useState(getNetworkInfo());
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const nav = navigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    function updateStatus() {
      setNetwork(getNetworkInfo());
      if (!navigator.onLine) setWasOffline(true);
    }
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  useEffect(() => {
    if (network.online && wasOffline) {
      // Show reconnect notification for 2 seconds
      const timeout = setTimeout(() => setWasOffline(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [network.online, wasOffline]);

  const color = getStatusColor(network);
  const colorMap = {
    green: '#3ec97a',
    yellow: '#ffd600',
    red: '#e74c3c',
  };
  const label = !network.online ? 'Offline' : color === 'yellow' ? 'Weak' : 'Online';
  const typeLabel = network.type && network.type !== 'unknown' ? `(${network.type})` : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 10, minWidth: 80 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
        <span style={{
          display: 'inline-block',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: colorMap[color],
          border: '1.5px solid #ccc',
          boxShadow: color === 'green' ? '0 0 2px #3ec97a' : color === 'yellow' ? '0 0 2px #ffd600' : '0 0 2px #e74c3c',
        }} />
        <span style={{ fontSize: '0.97em', color: color === 'red' ? '#e74c3c' : color === 'yellow' ? '#bfa900' : '#3ec97a' }}>{label}</span>
        <span style={{ fontSize: '0.85em', color: '#888', marginLeft: 2 }}>{typeLabel}</span>
      </span>
      {!network.online && (
        <span style={{ marginTop: 4, background: '#ffeaea', color: '#e74c3c', borderRadius: 6, padding: '2px 8px', fontSize: '0.92em', fontWeight: 500, boxShadow: '0 1px 4px rgba(231,76,60,0.07)' }}>
          Disconnected. Trying to reconnect...
        </span>
      )}
      {network.online && wasOffline && (
        <span style={{ marginTop: 4, background: '#eaffea', color: '#3ec97a', borderRadius: 6, padding: '2px 8px', fontSize: '0.92em', fontWeight: 500, boxShadow: '0 1px 4px rgba(62,201,122,0.07)' }}>
          Reconnected!
        </span>
      )}
    </div>
  );
} 