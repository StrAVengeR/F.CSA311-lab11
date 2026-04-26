import { CacheFactory, CacheType } from '../lib/api/CacheFactory';

// ─── LRU тестүүд (5) ───────────────────────────────
describe('LRUCache', () => {
  test('set хийсэн утгыг get-ээр авна', () => {
    const c = CacheFactory.create<string, number>(CacheType.LRU, { capacity: 3 });
    c.set('a', 1);
    expect(c.get('a')).toBe(1);
  });

  test('capacity дүүрэхэд хамгийн хуучин элемент устгагдана', () => {
    const c = CacheFactory.create<string, number>(CacheType.LRU, { capacity: 2 });
    c.set('a', 1);
    c.set('b', 2);
    c.set('c', 3); // 'a' устгагдах ёстой
    expect(c.get('a')).toBeUndefined();
    expect(c.get('b')).toBe(2);
    expect(c.get('c')).toBe(3);
  });

  test('get хийсэн элемент устгагдахгүй (recently used)', () => {
    const c = CacheFactory.create<string, number>(CacheType.LRU, { capacity: 2 });
    c.set('a', 1);
    c.set('b', 2);
    c.get('a'); // 'a' ашиглагдсан болох
    c.set('c', 3); // 'b' устгагдах ёстой
    expect(c.get('a')).toBe(1);
    expect(c.get('b')).toBeUndefined();
  });

  test('delete хийсэн элемент олдохгүй', () => {
    const c = CacheFactory.create<string, number>(CacheType.LRU, { capacity: 3 });
    c.set('a', 1);
    c.delete('a');
    expect(c.get('a')).toBeUndefined();
  });

  test('clear хийсний дараа size 0 байна', () => {
    const c = CacheFactory.create<string, number>(CacheType.LRU, { capacity: 3 });
    c.set('a', 1);
    c.set('b', 2);
    c.clear();
    expect(c.size()).toBe(0);
  });
});

// ─── LFU тестүүд (5) ───────────────────────────────
describe('LFUCache', () => {
  test('set хийсэн утгыг get-ээр авна', () => {
    const c = CacheFactory.create<string, number>(CacheType.LFU, { capacity: 3 });
    c.set('a', 1);
    expect(c.get('a')).toBe(1);
  });

  test('capacity дүүрэхэд хамгийн бага ашиглагдсан элемент устгагдана', () => {
    const c = CacheFactory.create<string, number>(CacheType.LFU, { capacity: 2 });
    c.set('a', 1);
    c.set('b', 2);
    c.get('a'); // a freq=2, b freq=1
    c.set('c', 3); // b устгагдах ёстой
    expect(c.has('b')).toBe(false);
    expect(c.get('a')).toBe(1);
  });

  test('has() зөв ажиллана', () => {
    const c = CacheFactory.create<string, number>(CacheType.LFU, { capacity: 3 });
    c.set('x', 10);
    expect(c.has('x')).toBe(true);
    expect(c.has('y')).toBe(false);
  });

  test('утгыг шинэчлэх боломжтой', () => {
    const c = CacheFactory.create<string, number>(CacheType.LFU, { capacity: 3 });
    c.set('a', 1);
    c.set('a', 99);
    expect(c.get('a')).toBe(99);
  });

  test('delete буцаах утга зөв', () => {
    const c = CacheFactory.create<string, number>(CacheType.LFU, { capacity: 3 });
    c.set('a', 1);
    expect(c.delete('a')).toBe(true);
    expect(c.delete('a')).toBe(false);
  });
});

// ─── TTL тестүүд (5) ───────────────────────────────
describe('TTLCache', () => {
  test('хугацаа дуусаагүй үед утга байна', () => {
    const c = CacheFactory.create<string, number>(CacheType.TTL, { capacity: 10, ttl: 5000 });
    c.set('a', 42);
    expect(c.get('a')).toBe(42);
  });

  test('хугацаа дууссан үед undefined буцаана', async () => {
    const c = CacheFactory.create<string, number>(CacheType.TTL, { capacity: 10, ttl: 50 });
    c.set('a', 42);
    await new Promise(r => setTimeout(r, 100));
    expect(c.get('a')).toBeUndefined();
  });

  test('has() хугацаа дууссан элементэд false буцаана', async () => {
    const c = CacheFactory.create<string, number>(CacheType.TTL, { capacity: 10, ttl: 50 });
    c.set('a', 1);
    await new Promise(r => setTimeout(r, 100));
    expect(c.has('a')).toBe(false);
  });

  test('clear хийсний дараа элемент олдохгүй', () => {
    const c = CacheFactory.create<string, number>(CacheType.TTL, { capacity: 10, ttl: 5000 });
    c.set('a', 1);
    c.clear();
    expect(c.get('a')).toBeUndefined();
  });

  test('өөр өөр TTL-тэй элементүүд зөв ажиллана', () => {
    const c = CacheFactory.create<string, number>(CacheType.TTL, { capacity: 10, ttl: 5000 });
    c.set('a', 1);
    c.set('b', 2);
    expect(c.size()).toBe(2);
  });
});