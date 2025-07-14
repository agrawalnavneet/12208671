import React, { useState } from 'react';

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
async function log(stack, level, pkg, message, token) {
  try {
    const body = JSON.stringify({ stack, level, package: pkg, message });
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (typeof fetch === 'function') {
      await fetch(LOG_API_URL, { method: 'POST', headers, body });
    }
  } catch (err) {}
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Simulate login (no backend user logic in this minimal version)
      if (!email || !password) throw new Error('Email and password required');
      log('frontend', 'info', 'component', 'User logged in');
      onLogin(email);
    } catch (err) {
      setError(err.message);
      log('frontend', 'error', 'component', `Login error: ${err.message}`);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
      <button type="submit">Login</button>
    </form>
  );
}

function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!email || !password || !name) throw new Error('All fields required');
      log('frontend', 'info', 'component', 'User registered');
      onRegister(email);
    } catch (err) {
      setError(err.message);
      log('frontend', 'error', 'component', `Register error: ${err.message}`);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required /><br />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
      <button type="submit">Register</button>
    </form>
  );
}

function UrlForm({ onShorten }) {
  const [url, setUrl] = useState('');
  const [validity, setValidity] = useState(30);
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      if (!url) throw new Error('URL required');
      const res = await fetch('http://localhost:3000/shorturls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, validity, shortcode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to shorten URL');
      setResult(data);
      log('frontend', 'info', 'component', 'Short URL created');
      if (onShorten) onShorten(data);
    } catch (err) {
      setError(err.message);
      log('frontend', 'error', 'component', `Shorten error: ${err.message}`);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Shorten URL</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input type="url" placeholder="Long URL" value={url} onChange={e => setUrl(e.target.value)} required /><br />
      <input type="number" placeholder="Validity (min)" value={validity} onChange={e => setValidity(e.target.value)} min={1} /><br />
      <input type="text" placeholder="Custom shortcode (optional)" value={shortcode} onChange={e => setShortcode(e.target.value)} /><br />
      <button type="submit">Shorten</button>
      {result && (
        <div style={{ marginTop: 10 }}>
          <div>Short Link: <a href={result.shortLink} target="_blank" rel="noopener noreferrer">{result.shortLink}</a></div>
          <div>Expiry: {result.expiry}</div>
        </div>
      )}
    </form>
  );
}

function Stats({ shortcode }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [input, setInput] = useState(shortcode || '');
  const handleFetch = async (e) => {
    e.preventDefault();
    setError('');
    setStats(null);
    try {
      const res = await fetch(`http://localhost:3000/shorturls/${input}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
      setStats(data);
      log('frontend', 'info', 'component', 'Fetched stats');
    } catch (err) {
      setError(err.message);
      log('frontend', 'error', 'component', `Stats error: ${err.message}`);
    }
  };
  return (
    <form onSubmit={handleFetch} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>URL Stats</h2>
      <input type="text" placeholder="Shortcode" value={input} onChange={e => setInput(e.target.value)} required />
      <button type="submit">Get Stats</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {stats && (
        <div style={{ marginTop: 10 }}>
          <div>Original URL: {stats.originalUrl}</div>
          <div>Created At: {stats.createdAt}</div>
          <div>Expiry: {stats.expiry}</div>
          <div>Clicks: {stats.clicks}</div>
          <div>Click Details:
            <ul>
              {stats.clickDetails.map((c, i) => (
                <li key={i}>{c.timestamp} | {c.referrer} | {c.geo}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </form>
  );
}

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <nav style={{ margin: 10 }}>
        <button onClick={() => setPage('login')}>Login</button>
        <button onClick={() => setPage('register')}>Register</button>
        <button onClick={() => setPage('shorten')}>Shorten URL</button>
        <button onClick={() => setPage('stats')}>Stats</button>
      </nav>
      {page === 'login' && <LoginForm onLogin={email => { setUser(email); setPage('shorten'); }} />}
      {page === 'register' && <RegisterForm onRegister={email => { setUser(email); setPage('shorten'); }} />}
      {page === 'shorten' && <UrlForm />}
      {page === 'stats' && <Stats />}
    </div>
  );
}

export default App; 