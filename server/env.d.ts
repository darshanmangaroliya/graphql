declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URL: string;
      PORT: string;
      REDIS_URL: string;
      SESSION_SECRET: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
