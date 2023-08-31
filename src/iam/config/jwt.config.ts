import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    accessExpiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
    refreshExpiresIn: parseInt(
      process.env.JWT_REFRESH_EXPIRES_IN ?? '86400',
      10,
    ),
  };
});
