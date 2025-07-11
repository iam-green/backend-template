export interface StateDto {
  /**
   * OAuth state parameter.
   *
   * @description The redirect URL to which the user should be redirected after authentication.
   */
  state?: string;
}
