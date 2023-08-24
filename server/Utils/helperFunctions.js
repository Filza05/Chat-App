const jwt = require("jsonwebtoken");

const createToken = (payload, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, {}, (err, token) => {
      if (err) reject(err);
      if (token) {
        resolve(token);
      }
    });
  });
};

module.exports = { createToken };
