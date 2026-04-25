/**
 * @typeParam 
 * @typeParam 
 */
export interface Cache<K, V> {
  set(key: K, value: V): void;

  get(key: K): V | undefined;

  delete(key: K): boolean;

  clear(): void;

  size(): number;

  has(key: K): boolean;
}