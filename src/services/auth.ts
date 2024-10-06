import httpStatus from 'http-status';
import ApiError from '../utils/api-error';
import { comparePassword, hashPassword } from '../utils/hashing';
import { createUser, getUser } from './user';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL_CLOUD || process.env.REDIS_URL_LOCAL,
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

type Payload = { id: number; email: string };

const logIn = async (data: { email: string; password: string }) => {
  const user = await getUser({ email: data.email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong password or email');
  }

  const payload = { id: user.id, email: user.email };
  return createAuthResponse(payload);
};

const register = async (data: { email: string; password: string }) => {
  const hashedPassword = await hashPassword(data.password);
  const user = await createUser({ email: data.email, password: hashedPassword });
  const payload = { id: user.id, email: user.email };
  return createAuthResponse(payload);
};

const logout = async (refreshToken: string) => {
  const { id: userId } = verifyToken(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || '');
  redisClient.hDel(userId.toString(), refreshToken);
};

const refreshToken = async (refreshToken: string) => {
  const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || '');

  if (!payload || !payload.id) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');

  if (!(await redisClient.hGet(payload.id.toString(), refreshToken)))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token');

  const accessToken = generateToken(
    { id: payload.id, email: payload.email },
    process.env.JWT_ACCESS_TOKEN_SECRET || '',
    process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
  );
  redisClient.hSet(payload.id.toString(), refreshToken, accessToken);
  return {
    accessToken,
    refreshToken,
  };
};

const createAuthResponse = (user: { id: number; email: string }) => {
  const accessToken = generateToken(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_TOKEN_SECRET || '',
    process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
  );
  const refreshToken = generateToken(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_TOKEN_SECRET || '',
    process.env.JWT_REFRESH_TOKEN_EXPIRE || '',
  );
  redisClient.hSet(user.id.toString(), refreshToken, accessToken);
  return {
    accessToken,
    refreshToken,
  };
};

const generateToken = (payload: Payload, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string): Payload => {
  return jwt.verify(token, secret) as Payload;
};

export { logIn, register, logout, refreshToken };
