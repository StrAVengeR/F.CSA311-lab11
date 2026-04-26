import { Cache } from './Cache';
import { LRUCache } from '../impl/LRUCache';
import { LFUCache } from '../impl/LFUCache';
import { TTLCache } from '../impl/TTLCache';
import { CacheException } from './CacheException';

export enum CacheType {
  LRU = 'LRU',
  LFU = 'LFU',
  TTL = 'TTL'
}

export interface CacheOptions {
  capacity: number;
  ttl?: number;
}

export class CacheFactory {
  static create<K, V>(type: CacheType, options: CacheOptions): Cache<K, V> {
    switch (type) {
      case CacheType.LRU:
        return new LRUCache<K, V>(options.capacity);
      case CacheType.LFU:
        return new LFUCache<K, V>(options.capacity);
      case CacheType.TTL:
        if (!options.ttl) throw new CacheException('TTL option required');
        return new TTLCache<K, V>(options.capacity, options.ttl);
      default:
        throw new CacheException(`Unknown cache type: ${type}`);
    }
  }
}