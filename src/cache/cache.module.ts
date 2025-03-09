import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Module({
  imports: [NestCacheModule.register({ ttl: 1000 * 60 })],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
