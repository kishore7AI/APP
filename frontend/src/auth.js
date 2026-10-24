import { createAuthClient } from '@neondatabase/neon-js/auth';

const authUrl =
  import.meta.env.VITE_NEON_AUTH_URL ||
  'https://ep-hidden-math-b5nl8tmj.neonauth.c-7.us-east-2.aws.neon.tech/neondb/auth';

export const authClient = createAuthClient(authUrl);
