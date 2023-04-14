import * as crypto from 'crypto'


export const base64URL = (s) => s.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

export const  rand = (fmt, depth = 32) => crypto.randomBytes(depth).toString(fmt);
