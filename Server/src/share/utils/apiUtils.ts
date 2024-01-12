import * as crypto from 'crypto';

export const base64URL = (s: string | Buffer): string =>
  s
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

export const rand = (fmt: BufferEncoding, depth = 32): string =>
  crypto.randomBytes(depth).toString(fmt);
