const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithRetry(url, options = {}, config = {}) {
  const { timeoutMs = 1500, retries = 2, delayMs = 200 } = config;
  const method = (options.method || 'GET').toUpperCase();
  const maxRetries = method === 'GET' ? retries : 0; // never retry writes

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let wait = delayMs * (2 ** attempt); // 200 ms, then 400 ms
    
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(timeoutMs),
      });
      
      // Stop looping if it succeeded, or if it's an error we shouldn't retry (like 404)
      if (!RETRY_STATUSES.has(res.status) || attempt >= maxRetries) {
        return res; 
      }
      
      const retryAfter = Number(res.headers.get('Retry-After'));
      if (res.status === 429 && retryAfter > 0) {
        wait = Math.min(retryAfter * 1000, 5000); // wait as asked, up to 5 s
      }
    } catch (err) {
      if (attempt >= maxRetries) throw err; // out of retries
    }
    
    console.warn(`attempt ${attempt + 1} failed, retrying in ${wait} ms`);
    await sleep(wait);
  }
}