import { Cache } from '../api/Cache';
import { CacheException } from '../api/CacheException';

class LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/**
 * LRU (Least Recently Used) Cache хэрэгжилт.
 * Хамгийн удаан ашиглагдаагүй элементийг устгана.
 */
export class LRUCache<K, V> implements Cache<K, V> {
  private capacity: number;
  private map: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V>; // хамгийн шинэ
  private tail: LRUNode<K, V>; // хамгийн хуучин

  constructor(capacity: number) {
    if (capacity <= 0) throw new CacheException('Capacity must be > 0');
    this.capacity = capacity;
    this.map = new Map();
    this.head = new LRUNode<K, V>(null as any, null as any);
    this.tail = new LRUNode<K, V>(null as any, null as any);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToFront(node);
    return node.value;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;
      this.moveToFront(node);
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev!;
        this.removeNode(lru);
        this.map.delete(lru.key);
      }
      const node = new LRUNode(key, value);
      this.map.set(key, node);
      this.addToFront(node);
    }
  }

  delete(key: K): boolean {
    const node = this.map.get(key);
    if (!node) return false;
    this.removeNode(node);
    this.map.delete(key);
    return true;
  }

  clear(): void {
    this.map.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  size(): number { return this.map.size; }
  has(key: K): boolean { return this.map.has(key); }

  private moveToFront(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.addToFront(node);
  }

  private removeNode(node: LRUNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private addToFront(node: LRUNode<K, V>): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }
}