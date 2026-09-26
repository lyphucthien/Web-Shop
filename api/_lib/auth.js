const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const bcrypt = require('bcryptjs');
const redis = require('./redis');

const COOKIE_NAME = 'lpt_token';
const SECRET = process.env.JWT_SECRET;

function signJWT(payload) {
  if (!SECRET) throw new Error('Thiếu biến môi trường JWT_SECRET.');
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

function verifyJWT(token) {
  if (!SECRET) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 ngày
  }));
}

function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  }));
}

function getTokenFromRequest(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies[COOKIE_NAME];
}

async function getUserFromRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = verifyJWT(token);
  if (!payload || !payload.username) return null;

  // Đảm bảo tài khoản vẫn tồn tại (phòng trường hợp đã bị xoá)
  const exists = await redis.exists(`user:${payload.username.toLowerCase()}`);
  if (!exists) return null;

  return { username: payload.username };
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

module.exports = {
  signJWT,
  verifyJWT,
  setAuthCookie,
  clearAuthCookie,
  getTokenFromRequest,
  getUserFromRequest,
  hashPassword,
  comparePassword,
};
