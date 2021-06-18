const PCrypt = require('../../helpers/PCrypt');

describe('PCrypt', () => {
  const password = '#bH3&&pcCa4M_MmcFXAG';
  test('should return salt', () => {
    expect(PCrypt.generateSalt).toBeDefined();
    expect(typeof PCrypt.generateSalt()).toEqual('string');
  });
  test('should return hash', () => {
    expect(PCrypt.setHash).toBeDefined();
    expect(typeof PCrypt.setHash(password).salt).toEqual('string');
    expect(typeof PCrypt.setHash(password).hash).toEqual('string');
  });
  test('hash for same string should be equal', () => {
    const { hash, salt } = PCrypt.setHash(password);
    expect(PCrypt.compare(password, hash, salt)).toBeTruthy();
  });
});
