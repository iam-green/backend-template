import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string) {
    return await this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cacheManager.set<T>(key, value, ttl ?? 1000 * 60);
  }

  async remove(key: string) {
    await this.cacheManager.del(key);
  }

  async clear() {
    await this.cacheManager.clear();
  }
}
