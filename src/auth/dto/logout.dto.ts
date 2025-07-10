import { tags } from 'typia';

export class LogoutDto {
  /**
   * The URL to redirect to after logout.
   */
  redirectUrl?: string & tags.Format<'uri'>;
}
