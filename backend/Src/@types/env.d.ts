declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      DATABASE_PASSWORD: string;

      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_COOKIE_EXPIRES_IN: number;

      EMAIL_FROM: string;
      EMAIL_HOST: string;
      EMAIL_PORT: number;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
    }
  }
}

export {};
