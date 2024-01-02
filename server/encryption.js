
const crypto = require("crypto");

const deriveKeyFromPassword = (password, salt) => {
    const iterations = 10000; 
    const keyLength = 32; 
  
    return crypto.pbkdf2Sync(password, salt, iterations, keyLength, "sha256");
  };


  const encrypt = (password, masterPassword) => {
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(16);
    const key = deriveKeyFromPassword(masterPassword, salt);
  
    const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
  
    const encryptedPassword = Buffer.concat([
      cipher.update(password),
      cipher.final(),
    ]);
  
    return {
        iv: iv.toString("hex"),
        salt: salt.toString("hex"),
        password: encryptedPassword.toString("hex"),
    };
  };


  const decrypt = (encryption, masterPassword) => {
    if (!encryption || !encryption.salt || !encryption.iv || !encryption.password) {
      throw new Error('Invalid encryption object');
    }
    const key = deriveKeyFromPassword(masterPassword, Buffer.from(encryption.salt, "hex"));
  
    const decipher = crypto.createDecipheriv(   
      "aes-256-ctr", 
      key,
      Buffer.from(encryption.iv, "hex")
    );
  
    const decryptedPassword = Buffer.concat([
      decipher.update(Buffer.from(encryption.password, "hex")),
      decipher.final(),
    ]);
  
    return decryptedPassword.toString();
};
  
module.exports = { encrypt, decrypt };

