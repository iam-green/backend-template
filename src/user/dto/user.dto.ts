import { tags } from 'typia';

export interface UserDto {
  /**
   * The user's UUID.
   */
  id: string & tags.Format<'uuid'>;

  /**
   * The user's Google ID.
   */
  google_id?: string;

  /**
   * The user's Discord ID.
   */
  discord_id?: string;

  /**
   * The user's email.
   */
  email: string & tags.Format<'email'>;

  /**
   * The date the user was created.
   */
  created: Date;
}
