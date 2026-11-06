class TTLCache {
  constructor(ttlMs, maxSize) {
    this.ttl = ttlMs;
    this.max = maxSize;
    this.store = new Map();
  }

  get(key) {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (Date.now() - hit.time >= this.ttl) {
      this.store.delete(key);
      return undefined;
    }
    return hit.data;
  }

  set(key, data) {
    if (!this.store.has(key) && this.store.size >= this.max) {
      this.store.delete(this.store.keys().next().value); // buang yang tertua
    }
    this.store.set(key, { data, time: Date.now() });
  }
}

module.exports = TTLCache;