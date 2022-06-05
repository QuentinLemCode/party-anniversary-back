declare namespace NodeJS {
  export interface ProcessEnv {
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_KEY: string;
    ORIGIN: string;
    PORT: number;
    PREFIX: string;
  }
}
