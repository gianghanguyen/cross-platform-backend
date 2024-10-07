import ApiError from '~/utils/api-error';
import { createAdmin, findAdmin, updateAdmin } from './admin';
import { comparePassword, hashPassword } from '~/utils/hashing';
import * as jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import httpStatus from 'http-status';

type Payload = { id: number; email: string };
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => {
    console.log('Redis client connected');
  })
  .catch((err) => {
    console.error('Redis client connection error', err);
  });

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

const adminLogin = async (email: string, password: string) => {
  const admin = await findAdmin({ email });
  if (!admin) {
    throw new ApiError(400, 'Admin not found');
  }

  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    throw new ApiError(400, 'Wrong password or email');
  }
  return createAuthResponse({ id: admin.id, email: admin.email });
};

const adminRegister = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  const admin = await createAdmin({ email, password: hashedPassword });
  return createAuthResponse({ id: admin.id, email: admin.email });
};

const changePassword = async (id: number, password: string, newPassword: string) => {
  const admin = await findAdmin({ id });
  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found');
  }

  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong password');
  }

  const hashedPassword = await hashPassword(newPassword);
  await updateAdmin({ id }, { password: hashedPassword });
};

const createAuthResponse = (payload: Payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN || '', {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_ADMIN || '',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN || '', {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_ADMIN || '',
  });
  redisClient.hSet(`admin:${payload.id}`, refreshToken, accessToken);
  return {
    accessToken,
    refreshToken,
  };
};

export { adminLogin, adminRegister, changePassword };
