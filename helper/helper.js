const crypto = require("crypto");

const validDomains = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "edu.in",
  "email.com",
  "icloud.com",
];

const isValidEmail = (str) => {
  str = str.trimStart();
  str = str.trimEnd();
  let domainName = "";
  let f = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "@") {
      i++;
      f = 1;
    }

    if (f === 1) {
      domainName += str[i];
    }
  }
  console.log("domainName: ", domainName);
  return validDomains.includes(domainName);
};

const isPasswordSecure = (str) => {
  return str.length >= 6;
};

const encrypt = (data, key) => {
  const algorithm = "aes-192-cbc";
  const iv = crypto.randomBytes(16);

  // const keyhex = new Buffer(key, "utf8");
  const keyMain = crypto.scryptSync(key, "salt", 24);
  const cipher = crypto.createCipher(algorithm, keyMain);

  const encrypted_token =
    cipher.update(data, "utf8", "hex") + cipher.final("hex");

  return { encrypted_token, iv };
};

const decrypt = (data, key, iv) => {
  const algorithm = "aes-192-cbc";
  // const iv = crypto.randomBytes(16);
  const keyMain = crypto.scryptSync(key, "salt", 24);

  const decipher = crypto.createDecipher(algorithm, keyMain);

  const decryted =
    decipher.update(data, "hex", "utf8") + decipher.final("utf8");

  return decryted;
};

module.exports = {
  isValidEmail,
  isPasswordSecure,
  encrypt,
  decrypt,
};
