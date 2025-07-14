
const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

async function log(stack, level, pkg, message, token) {
  try {
    const body = JSON.stringify({ stack, level, package: pkg, message });
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const fetch = (await import('node-fetch')).default;
    await fetch(LOG_API_URL, { method: 'POST', headers, body });
  } catch (err) {

  }
}

export default log; 