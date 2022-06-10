export interface UserLogin {
  access_token: string;
  id: number;
  username: string;
  expires_at: number;
  role: 'user' | 'admin';
}
