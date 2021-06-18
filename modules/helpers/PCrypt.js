const crypto = require('crypto');

class PCrypt {
  static generateSalt() {
    // Creating a unique salt
    return crypto.randomBytes(16).toString('hex');
  }

  // Method to set hash the password for a user
  static setHash(password) {
    // Hashing user's salt and password with 1000 iterations,
    const salt = this.generateSalt();
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  static compare(password, hash, salt) {
    const hashToCompare = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    if (hash === hashToCompare) {
      return true;
    }
    return false;
  }
}

module.exports = PCrypt;
