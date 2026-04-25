import { Cache } from './Cache';

export enum CacheType {
  LRU = 'LRU',
  LFU = 'LFU',
  TTL = 'TTL'
}

export interface CacheOptions {
  /** Максимум элементийн тоо */
  capacity: number;
  /** Амьдрах хугацаа мс-ээр — зөвхөн TTL кэшид */
  ttl?: number;
}

/**
 * Cache үүсгэх Factory.
 * Concrete класс гадагш гаргахгүй, зөвхөн Cache интерфейсээр ажиллана.
 */
export class CacheFactory {
  /**
   * Шинэ cache үүсгэнэ.
   * @param type - Cache-ийн төрөл (LRU / LFU / TTL)
   * @param options - Тохиргоо
   * @returns Cache интерфейс
   */
  static create<K, V>(type: CacheType, options: CacheOptions): Cache<K, V> {
    // 3-р өдөр хэрэгжилтүүдийг холбоно
    throw new Error('Not implemented yet');
  }
}