declare namespace NodeJS {
  export interface ProcessEnv {
    SPOTIFY_CLIENT_ID?: string;
    SPOTIFY_CLIENT_KEY?: string;
    ORIGIN?: string;
    PORT?: string;
    PREFIX?: string;
    DATABASE_HOST?: string;
    DATABASE_PORT?: string;
    DATABASE_USER?: string;
    DATABASE_PASSWORD?: string;
    DATABASE_NAME?: string;
    NODE_ENV: 'production' | 'developement' | 'build' | 'test';
    JWT_SECRET?: string;
  }
}
