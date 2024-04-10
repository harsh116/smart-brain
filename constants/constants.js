const ONE_DAY = 1000 * 60 * 60 * 24;
const CLARIFAI_API_USER_LIMIT = 20;
const CLARIFAI_API_GUEST_LIMIT = 2;
const PORT = process.env.PORT||8080;
// const SERVER_HOST = `http://localhost:${PORT}`;
// const CLIENT_HOST = "http://localhost:3001";
const CLIENT_HOST ='https://face-extractor-app.herokuapp.com';
                   const SERVER_HOST =   'https://face-extractor-app.herokuapp.com';
const CIPHER_KEY = "nice";

module.exports = {
  ONE_DAY,
  CLARIFAI_API_USER_LIMIT,
  SERVER_HOST,
  CLIENT_HOST,
  CLARIFAI_API_GUEST_LIMIT,
  CIPHER_KEY,
  PORT,
};
