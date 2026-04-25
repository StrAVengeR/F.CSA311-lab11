import { Cache } from './Cache';

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
  /**
   * @param type 
   * @param options 
   * @returns 
   */
  static create<K, V>(type: CacheType, options: CacheOptions): Cache<K, V> {
    throw new Error('Not implemented yet');
  }
}