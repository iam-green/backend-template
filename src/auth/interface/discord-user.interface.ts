export interface IDiscordUser {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  state?: string;
}
