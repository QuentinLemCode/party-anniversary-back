export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenWithCalculatedExpiration extends Token {
  expiryDate: Date;
}

export interface TokenPlayer {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface RegisteredPlayer extends TokenPlayer {
  expires_at: number;
}
