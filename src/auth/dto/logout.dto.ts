import { tags } from 'typia';

export interface LogoutDto {
  /**
   * The URL to redirect to after logout.
   */
  redirectUrl?: string & tags.Format<'uri'>;
}
