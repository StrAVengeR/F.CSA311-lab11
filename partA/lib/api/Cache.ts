/**
 * Түгээмэл кэш интерфейс
 * @typeParam K - Key-ийн төрөл
 * @typeParam V - Value-ийн төрөл
 */
export interface Cache<K, V> {
  /** Утга хадгална. */
  set(key: K, value: V): void;

  /** Утга авна. Олдоогүй бол undefined буцаана. */
  get(key: K): V | undefined;

  /** Түлхүүрийг устгана. Устгагдсан эсэхийг буцаана. */
  delete(key: K): boolean;

  /** Бүх утгыг устгана. */
  clear(): void;

  /** Хадгалагдсан элементийн тоо. */
  size(): number;

  /** Түлхүүр байгаа эсэхийг шалгана. */
  has(key: K): boolean;
}