import { OAuthDto } from './oauth.dto';

export interface UpdateOAuthDto
  extends Partial<
    Pick<OAuthDto, 'access_token' | 'refresh_token' | 'token_expire'>
  > {}
