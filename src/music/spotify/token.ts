export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenWithCalculatedExpiration extends Token {
  expiryDate: Date;
}

export interface TokenPlayer extends RefreshToken {
  refresh_token: string;
}

export interface RefreshToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export interface RegisteredPlayer extends TokenPlayer {
  expires_at: number;
}
