const jwt = require('jsonwebtoken');
const { BUYER, SELLER } = require('./constants');

const ALGORITHM = 'HS256';
const ISSUER = 'MVP-Match';
const AUDIENCE = [BUYER, SELLER];

const getToken = (req) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const getClaims = (userId, audience, username) => {
  const claims = {
    reserved: {
      algorithm: ALGORITHM,
      issuer: ISSUER,
      audience,
      expiresIn: '30mins',
      subject: `${userId}`,
    },
    application: {
      username,
    },
  };
  return claims;
};

const validateClaims = () => ({
  algorithm: ALGORITHM,
  issuer: ISSUER,
  audience: AUDIENCE,
});

const createToken = (userId, audience, username, role) => {
  const claims = getClaims(userId, audience, username, role);
  return jwt.sign(claims.application, process.env.JWT_SECRET, claims.reserved);
};

// eslint-disable-next-line consistent-return
const verifyToken = async (req, res, next) => {
  const token = getToken(req);

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET, validateClaims());

      req.user = {
        id: Number(decoded.sub),
        username: decoded.username,
        role: decoded.aud,
      };
      next();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return res.status(400).json({ status: 'Expired token' });
      }
      return res.status(400).json({ status: 'Invalid token' });
    }
  } else {
    return res.status(400).json({ status: 'No token provided' });
  }
};

module.exports = { createToken, verifyToken };
