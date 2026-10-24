(() => {
  'use strict';
  // IndexedDB is available on this HTTP deployment, where CacheStorage is not.
  // Cache only immutable, versioned Unity build bodies, never pages or video.
  const fetchNetwork = window.fetch.bind(window);
  const stats = window.browserBuildCache = { hits: [], writes: [], errors: [], pending: 0 };
  let database;
  function open() {
    if (!database) database = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Build cache database timed out')), 2000);
      const request = indexedDB.open('robot-unity-builds', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('bodies');
      request.onsuccess = () => { clearTimeout(timeout); resolve(request.result); };
      request.onerror = () => { clearTimeout(timeout); reject(request.error); };
      request.onblocked = () => { clearTimeout(timeout); reject(new Error('Build cache database is blocked')); };
    });
    return database;
  }
  async function read(key) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('bodies', 'readonly');
      const request = transaction.objectStore('bodies').get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function save(key, response) {
    stats.pending++;
    try {
      const body = await response.blob();
      const headers = Object.fromEntries(response.headers);
      // fetch() already decoded transport compression before producing the blob.
      delete headers['content-encoding'];
      headers['content-length'] = String(body.size);
      const db = await open();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction('bodies', 'readwrite');
        transaction.objectStore('bodies').put({ body, headers }, key);
        transaction.oncomplete = resolve;
        transaction.onabort = transaction.onerror = () => reject(transaction.error);
      });
      stats.writes.push(key);
    } catch (error) { stats.errors.push(String(error)); }
    finally { stats.pending--; }
  }
  window.fetch = async (input, options) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.href);
    const method = options?.method || (input instanceof Request ? input.method : 'GET');
    const headers = new Headers(options?.headers || (input instanceof Request ? input.headers : undefined));
    if (url.origin !== location.origin || method !== 'GET' || headers.has('Range') ||
        !/^\/experiment\/Build\/[^/]+\/[^/]+\.(data|wasm)$/.test(url.pathname)) return fetchNetwork(input, options);
    let canStore = true;
    try {
      const saved = await read(url.href);
      if (saved?.body instanceof Blob && saved.body.size > 0) {
        stats.hits.push(url.href);
        return new Response(saved.body, { status: 200, headers: saved.headers });
      }
    } catch (error) { canStore = false; stats.errors.push(String(error)); }
    const response = await fetchNetwork(input, options);
    if (response.status === 200 && canStore) void save(url.href, response.clone());
    return response;
  };
})();
