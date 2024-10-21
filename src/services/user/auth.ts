import httpStatus from 'http-status';
import ApiError from '../../utils/api-error';
import { comparePassword, hashPassword } from '../../utils/hashing';
import { createUser, getUser, updateUser } from './user';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';
import nodemailer from 'nodemailer';

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

type Payload = { id: number; email: string };

const logIn = async (data: { email: string; password: string }) => {
  const user = await getUser({ email: data.email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (!user.isActivated) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not activated');
  }

  if (!user.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not verified');
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong password or email');
  }

  const payload = { id: user.id, email: user.email };
  return createAuthResponse(payload);
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const register = async (data: { email: string; password: string }) => {
  const hashedPassword = await hashPassword(data.password);
  const user = await createUser({ email: data.email, password: hashedPassword });

  const verificationToken = generateToken(
    { id: user.id, email: user.email },
    process.env.JWT_EMAIL_SECRET || '',
    process.env.JWT_EMAIL_EXPIRE || '',
  );
  const verificationLink = `http://localhost:${process.env.PORT}/user/auth/verify-email?token=${verificationToken}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Verify your email',
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
  });
};

const logout = async (refreshToken: string) => {
  const { id: userId } = verifyToken(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET || '');
  redisClient.hDel(userId.toString(), refreshToken);
};

const verifyEmail = async (token: string) => {
  const payload = verifyToken(token, process.env.JWT_EMAIL_SECRET || '');
  const user = await getUser({ id: payload.id });

  if (!user) {
    throw new Error('User does not exist.');
  }
  await updateUser({ id: user.id }, { isVerified: true });
  return { message: 'Email verification successful!' };
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

const createAuthResponse = (payload: Payload) => {
  const accessToken = generateToken(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET || '',
    process.env.JWT_ACCESS_TOKEN_EXPIRE || '',
  );
  const refreshToken = generateToken(
    { id: payload.id, email: payload.email },
    process.env.JWT_REFRESH_TOKEN_SECRET || '',
    process.env.JWT_REFRESH_TOKEN_EXPIRE || '',
  );
  redisClient.hSet(payload.id.toString(), refreshToken, accessToken);
  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (id: number, password: string, newPassword: string) => {
  const user = await getUser({ id });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong password');
  }

  const hashedPassword = await hashPassword(newPassword);
  await updateUser({ id }, { password: hashedPassword });
  return { message: 'Password changed successfully' };
};

const generateToken = (payload: Payload, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string): Payload => {
  return jwt.verify(token, secret) as Payload;
};

export { logIn, register, logout, refreshToken, verifyEmail, changePassword };
