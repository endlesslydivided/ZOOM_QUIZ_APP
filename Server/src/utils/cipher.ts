import crypto from 'crypto';
import createError from 'http-errors';


const unpack = (ctx) => {
    let buf = Buffer.from(ctx, 'base64');

    const ivLength = buf.readUInt8();
    buf = buf.slice(1);

    const iv = buf.slice(0, ivLength);
    buf = buf.slice(ivLength);

    const aadLength = buf.readUInt16LE();
    buf = buf.slice(2);

    const aad = buf.slice(0, aadLength);
    buf = buf.slice(aadLength);

    const cipherLength = buf.readInt32LE();
    buf = buf.slice(4);

    const cipherText = buf.slice(0, cipherLength);

    const tag = buf.slice(cipherLength);

    return {
        iv,
        aad,
        cipherText,
        tag,
    };
}


const  decrypt = (cipherText, hash, iv, aad, tag) => {

    const decipher = crypto
        .createDecipheriv('aes-256-gcm', hash, iv)
        .setAAD(aad)
        .setAuthTag(tag)
        .setAutoPadding(false);

    const update = decipher.update(cipherText, 'hex', 'utf-8');
    const final = decipher.final('utf-8');

    const decrypted = update + final;

    return JSON.parse(decrypted);
}


export const getAppContext = (header, secret = '') => {
    if (!header || typeof header !== 'string')
        throw createError(500, 'context header must be a valid string');

    const key = secret || process.env.ZM_CLIENT_SECRET;

    const { iv, aad, cipherText, tag } = unpack(header);

    const hash = crypto.createHash('sha256').update(key).digest();

    return decrypt(cipherText, hash, iv, aad, tag);
}

export const contextHeader = 'x-zoom-app-context';
