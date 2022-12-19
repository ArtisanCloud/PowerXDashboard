const { createHash } = require('crypto');

export const HashPlainPassword = (plainText: string): string => {
  return createHash('sha256').update(plainText).digest('hex');
};
