export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenWithCalculatedExpiration extends Token {
  expiryDate: Date;
}
