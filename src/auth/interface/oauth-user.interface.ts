export interface IOAuthUser {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  state?: string;
}
