import { oauthTypeEnum } from 'src/database/database.enum';
import { tags } from 'typia';

export interface OAuthDto {
  /**
   * ID
   */
  id: string & tags.Format<'uuid'>;

  /**
   * OAuth ID
   */
  oauth_id: string;

  /**
   * User ID
   */
  user_id: string & tags.Format<'uuid'>;

  /**
   * OAuth type
   */
  type: (typeof oauthTypeEnum.enumValues)[number];

  /**
   * Access token
   */
  access_token: string | null;

  /**
   * Refresh token
   */
  refresh_token: string | null;

  /**
   * Token expire date
   */
  token_expire: Date;

  /**
   * Created date
   */
  created: Date;

  /**
   * Updated date
   */
  updated: Date;
}
