import { Cache } from '../api/Cache';
import { CacheException } from '../api/CacheException';

/**
 * TTL (Time To Live) Cache хэрэгжилт.
 * Тогтоосон хугацаа өнгөрөхөд элемент автоматаар хүчингүй болно.
 */
export class TTLCache<K, V> implements Cache<K, V> {
  private ttl: number;
  private store: Map<K, { value: V; expiresAt: number }>;

  constructor(capacity: number, ttl: number) {
    if (ttl <= 0) throw new CacheException('TTL must be > 0');
    this.ttl = ttl;
    this.store = new Map();
  }

  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttl });
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }

  clear(): void { this.store.clear(); }

  size(): number {
    // Хугацаа дууссан элементүүдийг тооцохгүй
    let count = 0;
    const now = Date.now();
    for (const entry of this.store.values()) {
      if (now <= entry.expiresAt) count++;
    }
    return count;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }
}