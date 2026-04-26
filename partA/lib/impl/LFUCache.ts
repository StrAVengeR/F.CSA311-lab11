import { Cache } from '../api/Cache';
import { CacheException } from '../api/CacheException';

/**
 * LFU (Least Frequently Used) Cache хэрэгжилт.
 * Хамгийн бага ашиглагдсан элементийг устгана.
 */
export class LFUCache<K, V> implements Cache<K, V> {
  private capacity: number;
  private minFreq: number;
  private keyMap: Map<K, { value: V; freq: number }>;
  private freqMap: Map<number, Set<K>>;

  constructor(capacity: number) {
    if (capacity <= 0) throw new CacheException('Capacity must be > 0');
    this.capacity = capacity;
    this.minFreq = 0;
    this.keyMap = new Map();
    this.freqMap = new Map();
  }

  get(key: K): V | undefined {
    const entry = this.keyMap.get(key);
    if (!entry) return undefined;
    this.incrementFreq(key, entry);
    return entry.value;
  }

  set(key: K, value: V): void {
  if (this.keyMap.has(key)) {
    const entry = this.keyMap.get(key)!;
    entry.value = value;
    this.incrementFreq(key, entry);
  } else {
    if (this.keyMap.size >= this.capacity) {
      const minSet = this.freqMap.get(this.minFreq)!;
      const evictKey = minSet.values().next().value as K;  
      minSet.delete(evictKey);
      this.keyMap.delete(evictKey);
    }
    this.keyMap.set(key, { value, freq: 1 });
    if (!this.freqMap.has(1)) this.freqMap.set(1, new Set<K>());
    this.freqMap.get(1)!.add(key);
    this.minFreq = 1;
  }
}

  delete(key: K): boolean {
    if (!this.keyMap.has(key)) return false;
    const entry = this.keyMap.get(key)!;
    this.freqMap.get(entry.freq)?.delete(key);
    this.keyMap.delete(key);
    return true;
  }

  clear(): void {
    this.keyMap.clear();
    this.freqMap.clear();
    this.minFreq = 0;
  }

  size(): number { return this.keyMap.size; }
  has(key: K): boolean { return this.keyMap.has(key); }

  private incrementFreq(key: K, entry: { value: V; freq: number }): void {
  const oldFreq = entry.freq;
  entry.freq++;
  
  const oldSet = this.freqMap.get(oldFreq);
  if (oldSet) oldSet.delete(key);
  
  if (!this.freqMap.has(entry.freq)) {
    this.freqMap.set(entry.freq, new Set<K>());
  }
  this.freqMap.get(entry.freq)!.add(key);
  
  if (oldSet?.size === 0 && this.minFreq === oldFreq) {
    this.minFreq++;
  }
}
}