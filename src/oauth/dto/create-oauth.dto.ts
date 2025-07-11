import { OAuthDto } from './oauth.dto';

export interface CreateOAuthDto
  extends Omit<OAuthDto, 'id' | 'created' | 'updated'> {}
