import React, { useState } from 'react';

const recommendedSites = [
  { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page' },
  { name: 'Simple English Wikipedia', url: 'https://simple.wikipedia.org/wiki/Main_Page' },
  { name: 'Project Gutenberg', url: 'https://www.gutenberg.org/' },
  { name: 'Public Domain Review', url: 'https://publicdomainreview.org/' },
  { name: 'Internet Archive', url: 'https://archive.org/' },

];

export default function StudyWebsite() {
  const [url, setUrl] = useState(recommendedSites[0].url);

  return (
    <div>
      <div className="mb-2 d-flex flex-wrap">
        {recommendedSites.map(site => (
          <button
            key={site.url}
            className={`btn btn-outline-secondary btn-sm me-2 mb-1${url === site.url ? ' active' : ''}`}
            onClick={() => setUrl(site.url)}
          >
            {site.name}
          </button>
        ))}
      </div>
      <div style={{height: 400, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', background: '#fff'}}>
        <iframe
          title="Study Website"
          src={url}
          style={{width: '100%', height: '100%', border: 'none'}}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
} 