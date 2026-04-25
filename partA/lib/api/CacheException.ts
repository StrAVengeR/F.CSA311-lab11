export class CacheException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheException';
  }
}